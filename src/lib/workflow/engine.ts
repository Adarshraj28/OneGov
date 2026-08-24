import { prisma } from "../db";
import { v4 as uuidv4 } from "uuid";

export interface WorkflowStep {
  serviceId: string;
  code: string;
  name: string;
  department: string;
  description: string;
  dependencies: string[];
  estimatedDays: number;
}

export async function createJourney(
  userId: string,
  intent: string,
  intentParsed: Record<string, unknown>,
  services: WorkflowStep[]
) {
  const journey = await prisma.serviceJourney.create({
    data: {
      userId,
      intent,
      intentParsed: JSON.stringify(intentParsed),
      status: "created",
      progress: 0,
    },
  });

  // Create steps with sequence numbers
  const steps = [];
  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    const step = await prisma.journeyStep.create({
      data: {
        journeyId: journey.id,
        serviceId: service.serviceId,
        status: i === 0 ? "in_progress" : "waiting",
        sequence: i + 1,
        retryCount: 0,
        maxRetries: 3,
      },
      include: {
        service: {
          include: { department: true },
        },
      },
    });
    steps.push(step);
  }

  return { journey, steps };
}

export async function getJourneyWithSteps(journeyId: string) {
  return prisma.serviceJourney.findUnique({
    where: { id: journeyId },
    include: {
      steps: {
        include: {
          service: {
            include: { department: true },
          },
          integrationRequests: true,
        },
        orderBy: { sequence: "asc" },
      },
      user: true,
    },
  });
}

export async function getUserJourneys(userId: string) {
  return prisma.serviceJourney.findMany({
    where: { userId },
    include: {
      steps: {
        include: {
          service: true,
        },
        orderBy: { sequence: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function canStepStart(
  step: { dependencies: string[] },
  completedSteps: string[]
): boolean {
  return step.dependencies.every((dep) => completedSteps.includes(dep));
}

export function calculateProgress(steps: { status: string }[]): number {
  if (steps.length === 0) return 0;
  const completed = steps.filter(
    (s) => s.status === "approved" || s.status === "completed"
  ).length;
  return Math.round((completed / steps.length) * 100);
}

export async function advanceJourney(journeyId: string) {
  const journey = await prisma.serviceJourney.findUnique({
    where: { id: journeyId },
    include: {
      steps: {
        include: { service: true },
        orderBy: { sequence: "asc" },
      },
    },
  });

  if (!journey) return null;

  const completedStepCodes = journey.steps
    .filter((s) => s.status === "approved" || s.status === "completed")
    .map((s) => s.service.code);

  // Find next eligible step
  for (const step of journey.steps) {
    if (step.status === "waiting" || step.status === "pending") {
      const deps = JSON.parse(
        (await prisma.service.findUnique({ where: { id: step.serviceId } }))
          ?.requiredDocuments || "[]"
      );

      // Simple dependency check: check if all previous steps are completed
      const previousSteps = journey.steps.filter(
        (s) => s.sequence < step.sequence
      );
      const allPreviousCompleted = previousSteps.every(
        (s) =>
          s.status === "approved" ||
          s.status === "completed" ||
          s.status === "submitted"
      );

      if (allPreviousCompleted && step.status === "waiting") {
        await prisma.journeyStep.update({
          where: { id: step.id },
          data: { status: "in_progress", startedAt: new Date() },
        });

        // Update journey
        const progress = calculateProgress(journey.steps);
        await prisma.serviceJourney.update({
          where: { id: journeyId },
          data: { status: "in_progress", progress },
        });

        return step;
      }
    }
  }

  // Check if all steps are done
  const allDone = journey.steps.every(
    (s) =>
      s.status === "approved" || s.status === "completed"
  );
  if (allDone) {
    await prisma.serviceJourney.update({
      where: { id: journeyId },
      data: { status: "completed", progress: 100 },
    });
  }

  return null;
}
