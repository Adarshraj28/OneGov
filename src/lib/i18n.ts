export type Language = "en" | "hi" | "mr" | "ta" | "te" | "bn" | "gu" | "kn" | "ml" | "pa";

export interface Translations {
  // Common
  appName: string;
  tagline: string;
  loading: string;
  signIn: string;
  signOut: string;
  profile: string;
  home: string;
  dashboard: string;
  services: string;
  settings: string;
  notifications: string;
  documents: string;
  viewAll: string;
  newRequest: string;
  discover: string;
  processing: string;
  total: string;
  completed: string;
  inProgress: string;
  pending: string;
  blocked: string;
  status: string;
  citizen: string;
  officer: string;
  admin: string;

  // Login
  loginTitle: string;
  loginSubtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginButton: string;
  loginError: string;
  networkError: string;
  demoAccounts: string;
  demoDescription: string;

  // Citizen Home
  heroTitle: string;
  heroSubtitle: string;
  whatToDo: string;
  searchPlaceholder: string;
  recentJourneys: string;
  totalJourneys: string;
  integratedServices: string;
  integratedServicesSubtitle: string;
  govFooter: string;
  govFooterSub: string;
  sihPrototype: string;

  // Journeys
  myJourneys: string;
  noJourneys: string;
  noJourneysDesc: string;
  servicesCount: string;
  progress: string;

  // Officer
  officerDashboard: string;
  officerSubtitle: string;
  totalApplications: string;
  recentApplications: string;
  citizenLabel: string;
  request: string;

  // Admin
  adminDashboard: string;
  adminSubtitle: string;
  simulationMetrics: string;
  totalUsers: string;
  departments: string;
  successRate: string;
  autoRecovered: string;
  integrationHealth: string;
  bottleneckAnalysis: string;
  noBottlenecks: string;
  recentActivity: string;
  digitalIndiaFooter: string;

  // Processing Steps
  processSteps: string[];

  // Quick Requests
  quickRequests: string[];

  // Government Services
  officialGovServices: string;
  govServicesSubtitle: string;

  // PM Modi Banner
  digitalIndiaInitiative: string;
  minimumGovernment: string;
  bannerDescription: string;
  makeInIndia: string;
  digitalIndia: string;
  citizenFirst: string;

  // Languages
  language: string;
  english: string;
  hindi: string;
  marathi: string;
  tamil: string;
  telugu: string;
  bengali: string;
  gujarati: string;
  kannada: string;
  malayalam: string;
  punjabi: string;

  // Notifications
  markAllRead: string;
  noNotifications: string;

  // Profile
  personalInfo: string;
  editProfile: string;
  saveChanges: string;

  // Documents
  myDocuments: string;
  uploadDocument: string;
  noDocuments: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: "ONEGOV",
    tagline: "Government Services, Connected Around You",
    loading: "Loading...",
    signIn: "Sign In",
    signOut: "Sign Out",
    profile: "Profile",
    home: "Home",
    dashboard: "Dashboard",
    services: "Services",
    settings: "Settings",
    notifications: "Notifications",
    documents: "Documents",
    viewAll: "View All",
    newRequest: "New Request",
    discover: "Discover",
    processing: "Processing...",
    total: "Total",
    completed: "Completed",
    inProgress: "In Progress",
    pending: "Pending",
    blocked: "Blocked",
    status: "Status",
    citizen: "Citizen",
    officer: "Officer",
    admin: "Admin",

    loginTitle: "Sign In",
    loginSubtitle: "Government Services, Connected Around You",
    emailLabel: "Email Address",
    emailPlaceholder: "Enter your email",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    loginButton: "Sign In",
    loginError: "Login failed",
    networkError: "Network error. Please try again.",
    demoAccounts: "Demo Accounts",
    demoDescription: "Click any account below to auto-fill credentials.",

    heroTitle: "Government services, connected around you.",
    heroSubtitle: "Tell us what you need. ONEGOV discovers the required services and guides you through one unified journey.",
    whatToDo: "What do you want to do?",
    searchPlaceholder: 'e.g., "I want to apply for a passport"',
    recentJourneys: "Recent Service Journeys",
    totalJourneys: "Total Journeys",
    integratedServices: "Official Government Services",
    integratedServicesSubtitle: "Integrated services from departments across India",
    govFooter: "Government of India — Digital India Initiative",
    govFooterSub: "ONEGOV is a prototype for Smart India Hackathon 2026",
    sihPrototype: "Problem Statement SIH26129 — Government of Maharashtra",

    myJourneys: "My Service Journeys",
    noJourneys: "No journeys yet. Start your first request!",
    noJourneysDesc: "Start your first government service request",
    servicesCount: "services",
    progress: "Progress",

    officerDashboard: "Officer Dashboard",
    officerSubtitle: "Monitor and manage citizen service applications",
    totalApplications: "Total Applications",
    recentApplications: "Recent Applications",
    citizenLabel: "Citizen",
    request: "Request",

    adminDashboard: "Admin Dashboard",
    adminSubtitle: "ONEGOV Platform Overview — Digital India",
    simulationMetrics: "Prototype Simulation Metrics",
    totalUsers: "Total Users",
    departments: "Departments",
    successRate: "Success Rate",
    autoRecovered: "Auto Recovered",
    integrationHealth: "Integration Health",
    bottleneckAnalysis: "Bottleneck Analysis",
    noBottlenecks: "No bottlenecks detected",
    recentActivity: "Recent Activity",
    digitalIndiaFooter: "ONEGOV — Digital India Initiative — Government of Maharashtra",

    processSteps: [
      "Understanding your request...",
      "Analyzing intent and location...",
      "Discovering required government services...",
      "Checking service dependencies...",
      "Building your unified service journey...",
      "Preparing service timeline...",
    ],

    quickRequests: [
      "I want to apply for a passport",
      "I need to update my Aadhaar card",
      "I want to open a restaurant in Pune",
      "I need a driving license",
      "I want to register a property",
      "I need a birth certificate",
    ],

    officialGovServices: "Official Government Services",
    govServicesSubtitle: "Integrated services from departments across India 🇮🇳",

    digitalIndiaInitiative: "Digital India Initiative",
    minimumGovernment: "Minimum Government, Maximum Governance",
    bannerDescription: "ONEGOV — Bringing all government services to your fingertips. One request, multiple services, one unified journey.",
    makeInIndia: "Make in India",
    digitalIndia: "Digital India",
    citizenFirst: "Citizen First",

    language: "Language",
    english: "English",
    hindi: "हिन्दी",
    marathi: "मराठी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    bengali: "বাংলা",
    gujarati: "ગુજરાતી",
    kannada: "ಕನ್ನಡ",
    malayalam: "മലയാളം",
    punjabi: "ਪੰਜਾਬੀ",

    markAllRead: "Mark all read",
    noNotifications: "No notifications",

    personalInfo: "Personal Information",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",

    myDocuments: "My Documents",
    uploadDocument: "Upload Document",
    noDocuments: "No documents uploaded yet",
  },

  hi: {
    appName: "वनगोव",
    tagline: "सरकारी सेवाएं, आपके आस-पास जुड़ी हुई",
    loading: "लोड हो रहा है...",
    signIn: "साइन इन करें",
    signOut: "साइन आउट",
    profile: "प्रोफ़ाइल",
    home: "होम",
    dashboard: "डैशबोर्ड",
    services: "सेवाएं",
    settings: "सेटिंग्स",
    notifications: "सूचनाएं",
    documents: "दस्तावेज़",
    viewAll: "सभी देखें",
    newRequest: "नया अनुरोध",
    discover: "खोजें",
    processing: "प्रसंस्करण...",
    total: "कुल",
    completed: "पूर्ण",
    inProgress: "प्रगति में",
    pending: "लंबित",
    blocked: "अवरुद्ध",
    status: "स्थिति",
    citizen: "नागरिक",
    officer: "अधिकारी",
    admin: "प्रशासक",

    loginTitle: "साइन इन करें",
    loginSubtitle: "सरकारी सेवाएं, आपके आस-पास जुड़ी हुई",
    emailLabel: "ईमेल पता",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    loginButton: "साइन इन करें",
    loginError: "लॉगिन विफल",
    networkError: "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।",
    demoAccounts: "डेमो खाते",
    demoDescription: "क्रेडेंशियल स्वतः भरने के लिए नीचे कोई भी खाता क्लिक करें।",

    heroTitle: "सरकारी सेवाएं, आपके आस-पास जुड़ी हुई।",
    heroSubtitle: "हमें बताएं आपको क्या चाहिए। ONEGOV आवश्यक सेवाओं की खोज करता है और आपको एक एकीकृत यात्रा में मार्गदर्शन करता है।",
    whatToDo: "आप क्या करना चाहते हैं?",
    searchPlaceholder: 'जैसे, "मैं पासपोर्ट के लिए आवेदन करना चाहता हूं"',
    recentJourneys: "हाल की सेवा यात्राएं",
    totalJourneys: "कुल यात्राएं",
    integratedServices: "आधिकारिक सरकारी सेवाएं",
    integratedServicesSubtitle: "भारत भर के विभागों से एकीकृत सेवाएं",
    govFooter: "भारत सरकार — डिजिटल इंडिया पहल",
    govFooterSub: "ONEGOV स्मार्ट इंडिया हैकाथॉन 2026 का प्रोटोटाइप है",
    sihPrototype: "समस्या कथन SIH26129 — महाराष्ट्र सरकार",

    myJourneys: "मेरी सेवा यात्राएं",
    noJourneys: "अभी तक कोई यात्रा नहीं। अपना पहला अनुरोध शुरू करें!",
    noJourneysDesc: "अपना पहला सरकारी सेवा अनुरोध शुरू करें",
    servicesCount: "सेवाएं",
    progress: "प्रगति",

    officerDashboard: "अधिकारी डैशबोर्ड",
    officerSubtitle: "नागरिक सेवा आवेदनों की निगरानी और प्रबंधन करें",
    totalApplications: "कुल आवेदन",
    recentApplications: "हाल के आवेदन",
    citizenLabel: "नागरिक",
    request: "अनुरोध",

    adminDashboard: "प्रशासक डैशबोर्ड",
    adminSubtitle: "ONEGOV प्लेटफ़ॉर्म अवलोकन — डिजिटल इंडिया",
    simulationMetrics: "प्रोटोटाइप सिमुलेशन मेट्रिक्स",
    totalUsers: "कुल उपयोगकर्ता",
    departments: "विभाग",
    successRate: "सफलता दर",
    autoRecovered: "स्वतः ठीक",
    integrationHealth: "एकीकरण स्वास्थ्य",
    bottleneckAnalysis: "बोतलनेक विश्लेषण",
    noBottlenecks: "कोई बोतलनेक नहीं मिला",
    recentActivity: "हाल की गतिविधि",
    digitalIndiaFooter: "ONEGOV — डिजिटल इंडिया पहल — महाराष्ट्र सरकार",

    processSteps: [
      "आपके अनुरोध को समझ रहे हैं...",
      "इरादा और स्थान का विश्लेषण...",
      "आवश्यक सरकारी सेवाओं की खोज...",
      "सेवा निर्भरता की जांच...",
      "आपकी एकीकृत सेवा यात्रा बना रहे हैं...",
      "सेवा समयरेखा तैयार कर रहे हैं...",
    ],

    quickRequests: [
      "मैं पासपोर्ट के लिए आवेदन करना चाहता हूं",
      "मुझे अपना आधार कार्ड अपडेट करना है",
      "मैं पुणे में रेस्तरां खोलना चाहता हूं",
      "मुझे ड्राइविंग लाइसेंस चाहिए",
      "मैं संपत्ति पंजीकृत करना चाहता हूं",
      "मुझे जन्म प्रमाण पत्र चाहिए",
    ],

    officialGovServices: "आधिकारिक सरकारी सेवाएं",
    govServicesSubtitle: "भारत भर के विभागों से एकीकृत सेवाएं 🇮🇳",

    digitalIndiaInitiative: "डिजिटल इंडिया पहल",
    minimumGovernment: "न्यूनतम सरकार, अधिकतम शासन",
    bannerDescription: "ONEGOV — सभी सरकारी सेवाएं आपकी उंगलियों पर। एक अनुरोध, कई सेवाएं, एक एकीकृत यात्रा।",
    makeInIndia: "मेक इन इंडिया",
    digitalIndia: "डिजिटल इंडिया",
    citizenFirst: "नागरिक पहले",

    language: "भाषा",
    english: "English",
    hindi: "हिन्दी",
    marathi: "मराठी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    bengali: "বাংলা",
    gujarati: "ગુજરાતી",
    kannada: "ಕನ್ನಡ",
    malayalam: "മലയാളം",
    punjabi: "ਪੰਜਾਬੀ",

    markAllRead: "सभी पठित चिन्हित करें",
    noNotifications: "कोई सूचना नहीं",

    personalInfo: "व्यक्तिगत जानकारी",
    editProfile: "प्रोफ़ाइल संपादित करें",
    saveChanges: "परिवर्तन सहेजें",

    myDocuments: "मेरे दस्तावेज़",
    uploadDocument: "दस्तावेज़ अपलोड करें",
    noDocuments: "अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया",
  },

  mr: {
    appName: "वनगोव",
    tagline: "सरकारी सेवा, तुमच्या भोवती जोडलेल्या",
    loading: "लोड होत आहे...",
    signIn: "साइन इन करा",
    signOut: "साइन आउट",
    profile: "प्रोफाइल",
    home: "होम",
    dashboard: "डॅशबोर्ड",
    services: "सेवा",
    settings: "सेटिंग्ज",
    notifications: "सूचना",
    documents: "दस्तऐवज",
    viewAll: "सर्व पहा",
    newRequest: "नवीन विनंती",
    discover: "शोधा",
    processing: "प्रक्रिया...",
    total: "एकूण",
    completed: "पूर्ण",
    inProgress: "प्रगतीत",
    pending: "प्रलंबित",
    blocked: "अडवलेले",
    status: "स्थिती",
    citizen: "नागरिक",
    officer: "अधिकारी",
    admin: "प्रशासक",

    loginTitle: "साइन इन करा",
    loginSubtitle: "सरकारी सेवा, तुमच्या भोवती जोडलेल्या",
    emailLabel: "ईमेल पत्ता",
    emailPlaceholder: "तुमचा ईमेल प्रविष्ट करा",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "तुमचा पासवर्ड प्रविष्ट करा",
    loginButton: "साइन इन करा",
    loginError: "लॉगिन अयशस्वी",
    networkError: "नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.",
    demoAccounts: "डेमो खाते",
    demoDescription: "क्रेडेन्शियल्स स्वयं भरण्यासाठीखालील कोणतेही खाते क्लिक करा.",

    heroTitle: "सरकारी सेवा, तुमच्या भोवती जोडलेल्या.",
    heroSubtitle: "आम्हाला सांगा तुम्हाला काय हवे आहे. ONEGOV आवश्यक सेवा शोधते आणि तुम्हाला एकीकृत प्रवासात मार्गदर्शन करते.",
    whatToDo: "तुम्हाला काय करायचे आहे?",
    searchPlaceholder: 'उदा., "मला पासपोर्टसाठी अर्ज करायचा आहे"',
    recentJourneys: "अलीकडील सेवा प्रवास",
    totalJourneys: "एकूण प्रवास",
    integratedServices: "अधिकृत सरकारी सेवा",
    integratedServicesSubtitle: "संपूर्ण भारतातील विभागांमधून एकीकृत सेवा",
    govFooter: "भारत सरकार — डिजिटल इंडिया उपक्रम",
    govFooterSub: "ONEGOV स्मार्ट इंडिया हॅकाथॉन 2026 चे प्रोटोटाइप आहे",
    sihPrototype: "समस्या विधान SIH26129 — महाराष्ट्र शासन",

    myJourneys: "माझे सेवा प्रवास",
    noJourneys: "अजून कोणतेही प्रवास नाही. तुमची पहिली विनंती सुरू करा!",
    noJourneysDesc: "तुमची पहिली सरकारी सेवा विनंती सुरू करा",
    servicesCount: "सेवा",
    progress: "प्रगती",

    officerDashboard: "अधिकारी डॅशबोर्ड",
    officerSubtitle: "नागरिक सेवा अर्जांचे निरीक्षण आणि व्यवस्थापन करा",
    totalApplications: "एकूण अर्ज",
    recentApplications: "अलीकडील अर्ज",
    citizenLabel: "नागरिक",
    request: "विनंती",

    adminDashboard: "प्रशासक डॅशबोर्ड",
    adminSubtitle: "ONEGOV प्लॅटफॉर्म आढावा — डिजिटल इंडिया",
    simulationMetrics: "प्रोटोटाइप सिम्युलेशन मेट्रिक्स",
    totalUsers: "एकूण वापरकर्ते",
    departments: "विभाग",
    successRate: "यश दर",
    autoRecovered: "स्वयं बरे झाले",
    integrationHealth: "एकीकरण आरोग्य",
    bottleneckAnalysis: "बोतलनेक विश्लेषण",
    noBottlenecks: "बोतलनेक आढळले नाही",
    recentActivity: "अलीकडील क्रियाकलाप",
    digitalIndiaFooter: "ONEGOV — डिजिटल इंडिया उपक्रम — महाराष्ट्र शासन",

    processSteps: [
      "तुमच्या विनंती समजून घेत आहोत...",
      "हेतू आणि स्थानाचे विश्लेषण...",
      "आवश्यक सरकारी सेवा शोधत आहोत...",
      "सेवा अवलंबित्व तपासत आहोत...",
      "तुमचा एकीकृत सेवा प्रवास तयार करत आहोत...",
      "सेवा कालावधी तयार करत आहोत...",
    ],

    quickRequests: [
      "मला पासपोर्टसाठी अर्ज करायचा आहे",
      "माझा आधार कार्ड अपडेट करायचा आहे",
      "मला पुण्यात रेस्टॉरंट उघडायचे आहे",
      "मला ड्रायव्हिंग लायसन्स हवे आहे",
      "मला मालमत्ता नोंदवायची आहे",
      "मला जन्मप्रमाणपत्र हवे आहे",
    ],

    officialGovServices: "अधिकृत सरकारी सेवा",
    govServicesSubtitle: "संपूर्ण भारतातील विभागांमधून एकीकृत सेवा 🇮🇳",

    digitalIndiaInitiative: "डिजिटल इंडिया उपक्रम",
    minimumGovernment: "किमान शासन, कमाल शासन",
    bannerDescription: "ONEGOV — सर्व सरकारी सेवा तुमच्या बोटांवर. एक विनंती, अनेक सेवा, एक एकीकृत प्रवास.",
    makeInIndia: "मेक इन इंडिया",
    digitalIndia: "डिजिटल इंडिया",
    citizenFirst: "नागरिक प्रथम",

    language: "भाषा",
    english: "English",
    hindi: "हिन्दी",
    marathi: "मराठी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    bengali: "বাংলা",
    gujarati: "ગુજરાતી",
    kannada: "ಕನ್ನಡ",
    malayalam: "മലയാളം",
    punjabi: "ਪੰਜਾਬੀ",

    markAllRead: "सर्व वाचलेले चिन्हांकित करा",
    noNotifications: "कोणतीही सूचना नाही",

    personalInfo: "वैयक्तिक माहिती",
    editProfile: "प्रोफाइल संपादित करा",
    saveChanges: "बदल जतन करा",

    myDocuments: "माझे दस्तऐवज",
    uploadDocument: "दस्तऐवज अपलोड करा",
    noDocuments: "अजून कोणतेही दस्तऐवज अपलोड केले नाही",
  },

  ta: {
    appName: "வன்கோவ்",
    tagline: "அரசு சேவைகள், உங்களுடன் இணைக்கப்பட்டவை",
    loading: "ஏற்றுகிறது...",
    signIn: "உள்நுழை",
    signOut: "வெளியேறு",
    profile: "சுயவிவரம்",
    home: "முகப்பு",
    dashboard: "டாஷ்போர்டு",
    services: "சேவைகள்",
    settings: "அமைப்புகள்",
    notifications: "அறிவிப்புகள்",
    documents: "ஆவணங்கள்",
    viewAll: "அனைத்தும் காண்க",
    newRequest: "புதிய கோரிக்கை",
    discover: "கண்டறி",
    processing: "செயலாக்கம்...",
    total: "மொத்தம்",
    completed: "நிறைவடைந்தது",
    inProgress: "நடப்பில்",
    pending: "நிலுவையில்",
    blocked: "தடுக்கப்பட்டது",
    status: "நிலை",
    citizen: "குடிமகன்",
    officer: "அதிகாரி",
    admin: "நிர்வாகி",

    loginTitle: "உள்நுழை",
    loginSubtitle: "அரசு சேவைகள், உங்களுடன் இணைக்கப்பட்டவை",
    emailLabel: "மின்னஞ்சல் முகவரி",
    emailPlaceholder: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
    passwordLabel: "கடவுச்சொல்",
    passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
    loginButton: "உள்நுழை",
    loginError: "உள்நுழைவு தோல்வி",
    networkError: "நெட்வொர்க் பிழை. மீண்டும் முயற்சிக்கவும்.",
    demoAccounts: "டெமோ கணக்குகள்",
    demoDescription: "சான்றுகளை தானாக நிரப்ப கீழே எந்த கணக்கையும் கிளிக் செய்யவும்.",

    heroTitle: "அரசு சேவைகள், உங்களுடன் இணைக்கப்பட்டவை.",
    heroSubtitle: "உங்களுக்கு என்ன வேண்டும் என்று சொல்லுங்கள். ONEGOV தேவையான சேவைகளை கண்டறிந்து ஒருங்கிணைந்த பயணத்தில் வழிநடத்துகிறது.",
    whatToDo: "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
    searchPlaceholder: 'எ.கா., "நான் கடவுச்சீட்டுக்கு விண்ணப்பிக்க விரும்புகிறேன்"',
    recentJourneys: "சமீபத்திய சேவை பயணங்கள்",
    totalJourneys: "மொத்த பயணங்கள்",
    integratedServices: "அதிகாரப்பூர்வ அரசு சேவைகள்",
    integratedServicesSubtitle: "இந்தியா முழுவதும் துறைகளில் இருந்து ஒருங்கிணைந்த சேவைகள்",
    govFooter: "இந்திய அரசு — டிஜிட்டல் இந்தியா முயற்சி",
    govFooterSub: "ONEGOV ஸ்மார்ட் இந்தியா ஹேக்கத்தான் 2026 ப்ரோட்டோடைப் ஆகும்",
    sihPrototype: "சிக்கல் அறிக்கை SIH26129 — மகாராஷ்டிரா அரசு",

    myJourneys: "என் சேவை பயணங்கள்",
    noJourneys: "இன்னும் பயணங்கள் இல்லை. உங்கள் முதல் கோரிக்கையைத் தொடங்குங்கள்!",
    noJourneysDesc: "உங்கள் முதல் அரசு சேவை கோரிக்கையைத் தொடங்குங்கள்",
    servicesCount: "சேவைகள்",
    progress: "முன்னேற்றம்",

    officerDashboard: "அதிகாரி டாஷ்போர்டு",
    officerSubtitle: "குடிமக்கள் சேவை விண்ணப்பங்களை கண்காணிக்கவும் நிர்வகிக்கவும்",
    totalApplications: "மொத்த விண்ணப்பங்கள்",
    recentApplications: "சமீபத்திய விண்ணப்பங்கள்",
    citizenLabel: "குடிமகன்",
    request: "கோரிக்கை",

    adminDashboard: "நிர்வாகி டாஷ்போர்டு",
    adminSubtitle: "ONEGOV தளம் மேலோட்டம் — டிஜிட்டல் இந்தியா",
    simulationMetrics: "ப்ரோட்டோடைப் சிமுலேஷன் அளவீடுகள்",
    totalUsers: "மொத்த பயனர்கள்",
    departments: "துறைகள்",
    successRate: "வெற்றி விகிதம்",
    autoRecovered: "தானாக மீட்கப்பட்டது",
    integrationHealth: "ஒருங்கிணைப்பு ஆரோக்கியம்",
    bottleneckAnalysis: "இடுப்பு பகுப்பாய்வு",
    noBottlenecks: "இடுப்புகள் இல்லை",
    recentActivity: "சமீபத்திய செயல்பாடு",
    digitalIndiaFooter: "ONEGOV — டிஜிட்டல் இந்தியா முயற்சி — மகாராஷ்டிரா அரசு",

    processSteps: [
      "உங்கள் கோரிக்கையை புரிந்துகொள்கிறோம்...",
      "நோக்கம் மற்றும் இடத்தை பகுப்பாய்கிறோம்...",
      "தேவையான அரசு சேவைகளை கண்டறிகிறோம்...",
      "சேவை சார்புகளை சரிபார்க்கிறோம்...",
      "உங்கள் ஒருங்கிணைந்த சேவை பயணத்தை உருவாக்குகிறோம்...",
      "சேவை காலவரிசையை தயாரிக்கிறோம்...",
    ],

    quickRequests: [
      "நான் கடவுச்சீட்டுக்கு விண்ணப்பிக்க விரும்புகிறேன்",
      "என் ஆதார் அட்டையை புதுப்பிக்க வேண்டும்",
      "நான் புனேவில் உணவகம் திறக்க விரும்புகிறேன்",
      "எனக்கு ஓட்டுநர் உரிமம் வேண்டும்",
      "நான் சொத்து பதிவு செய்ய விரும்புகிறேன்",
      "எனக்கு பிறப்புச் சான்றிதழ் வேண்டும்",
    ],

    officialGovServices: "அதிகாரப்பூர்வ அரசு சேவைகள்",
    govServicesSubtitle: "இந்தியா முழுவதும் துறைகளில் இருந்து ஒருங்கிணைந்த சேவைகள் 🇮🇳",

    digitalIndiaInitiative: "டிஜிட்டல் இந்தியா முயற்சி",
    minimumGovernment: "குறைந்தபட்ச அரசு, அதிகபட்ச ஆட்சி",
    bannerDescription: "ONEGOV — அனைத்து அரசு சேவைகளும் உங்கள் விரல்களில். ஒரு கோரிக்கை, பல சேவைகள், ஒருங்கிணைந்த பயணம்.",
    makeInIndia: "மேக் இன் இந்தியா",
    digitalIndia: "டிஜிட்டல் இந்தியா",
    citizenFirst: "குடிமகன் முதல்",

    language: "மொழி",
    english: "English",
    hindi: "हिन्दी",
    marathi: "मराठी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    bengali: "বাংলা",
    gujarati: "ગુજરાતી",
    kannada: "ಕನ್ನಡ",
    malayalam: "മലയാളം",
    punjabi: "ਪੰਜਾਬੀ",

    markAllRead: "அனைத்தும் படிக்கப்பட்டதாக குறி",
    noNotifications: "அறிவிப்புகள் இல்லை",

    personalInfo: "தனிப்பட்ட தகவல்",
    editProfile: "சுயவிவரத்தைத் திருத்து",
    saveChanges: "மாற்றங்களைச் சேமி",

    myDocuments: "என் ஆவணங்கள்",
    uploadDocument: "ஆவணத்தை பதிவேற்று",
    noDocuments: "இன்னும் ஆவணங்கள் பதிவேற்றப்படவில்லை",
  },

  te: {
    appName: "వన్‌గోవ్",
    tagline: "ప్రభుత్వ సేవలు, మీతో కలిపి ఉన్నాయి",
    loading: "లోడ్ అవుతోంది...",
    signIn: "సైన్ ఇన్",
    signOut: "సైన్ అవుట్",
    profile: "ప్రొఫైల్",
    home: "హోమ్",
    dashboard: "డాష్‌బోర్డ్",
    services: "సేవలు",
    settings: "సెట్టింగ్‌లు",
    notifications: "నోటిఫికేషన్‌లు",
    documents: "పత్రాలు",
    viewAll: "అన్నీ చూడండి",
    newRequest: "కొత్త అభ్యర్థన",
    discover: "కనుగొనండి",
    processing: "ప్రాసెసింగ్...",
    total: "మొత్తం",
    completed: "పూర్తయింది",
    inProgress: "పురోగతిలో",
    pending: "పెండింగ్",
    blocked: "బ్లాక్ చేయబడింది",
    status: "స్థితి",
    citizen: "పౌరుడు",
    officer: "అధికారి",
    admin: "అడ్మిన్",

    loginTitle: "సైన్ ఇన్",
    loginSubtitle: "ప్రభుత్వ సేవలు, మీతో కలిపి ఉన్నాయి",
    emailLabel: "ఇమెయిల్ చిరునామా",
    emailPlaceholder: "మీ ఇమెయిల్ నమోదు చేయండి",
    passwordLabel: "పాస్‌వర్డ్",
    passwordPlaceholder: "మీ పాస్‌వర్డ్ నమోదు చేయండి",
    loginButton: "సైన్ ఇన్",
    loginError: "లాగిన్ విఫలమైంది",
    networkError: "నెట్‌వర్క్ లోపం. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    demoAccounts: "డెమో ఖాతాలు",
    demoDescription: "క్రెడెన్షియల్స్ ఆటో-ఫిల్ చేయడానికి క్రింద ఏదైనా ఖాతాను క్లిక్ చేయండి.",

    heroTitle: "ప్రభుత్వ సేవలు, మీతో కలిపి ఉన్నాయి.",
    heroSubtitle: "మీకు ఏమి కావాలో మాకు చెప్పండి. ONEGOV అవసరమైన సేవలను కనుగొని ఏకీకృత ప్రయాణంలో మిమ్మల్ని నడిపిస్తుంది.",
    whatToDo: "మీరు ఏమి చేయాలనుకుంటున్నారు?",
    searchPlaceholder: 'ఉదా., "నేను పాస్‌పోర్ట్ కోసం దరఖాస్తు చేయాలనుకుంటున్నాను"',
    recentJourneys: "ఇటీవలి సేవా ప్రయాణాలు",
    totalJourneys: "మొత్తం ప్రయాణాలు",
    integratedServices: "అధికారిక ప్రభుత్వ సేవలు",
    integratedServicesSubtitle: "భారతదేశం అంతటా శాఖల నుండి ఏకీకృత సేవలు",
    govFooter: "భారత ప్రభుత్వం — డిజిటల్ ఇండియా ఇనిషియేటివ్",
    govFooterSub: "ONEGOV స్మార్ట్ ఇండియా హ్యాకథాన్ 2026 ప్రోటోటైప్",
    sihPrototype: "సమస్య స్టేట్‌మెంట్ SIH26129 — మహారాష్ట్ర ప్రభుత్వం",

    myJourneys: "నా సేవా ప్రయాణాలు",
    noJourneys: "ఇంకా ప్రయాణాలు లేవు. మీ మొదటి అభ్యర్థనను ప్రారంభించండి!",
    noJourneysDesc: "మీ మొదటి ప్రభుత్వ సేవా అభ్యర్థనను ప్రారంభించండి",
    servicesCount: "సేవలు",
    progress: "పురోగతి",

    officerDashboard: "అధికారి డాష్‌బోర్డ్",
    officerSubtitle: "పౌర సేవా దరఖాస్తులను పర్యవేక్షించండి మరియు నిర్వహించండి",
    totalApplications: "మొత్తం దరఖాస్తులు",
    recentApplications: "ఇటీవలి దరఖాస్తులు",
    citizenLabel: "పౌరుడు",
    request: "అభ్యర్థన",

    adminDashboard: "అడ్మిన్ డాష్‌బోర్డ్",
    adminSubtitle: "ONEGOV ప్లాట్‌ఫారం అవలోకనం — డిజిటల్ ఇండియా",
    simulationMetrics: "ప్రోటోటైప్ సిమ్యులేషన్ మెట్రిక్స్",
    totalUsers: "మొత్తం వినియోగదారులు",
    departments: "శాఖలు",
    successRate: "విజయ రేటు",
    autoRecovered: "ఆటో రికవర్ చేయబడింది",
    integrationHealth: "ఏకీకరణ ఆరోగ్యం",
    bottleneckAnalysis: "బోట్ల్‌నెక్ విశ్లేషణ",
    noBottlenecks: "బోట్ల్‌నెక్‌లు కనుగొనబడలేదు",
    recentActivity: "ఇటీవలి కార్యాచరణ",
    digitalIndiaFooter: "ONEGOV — డిజిటల్ ఇండియా ఇనిషియేటివ్ — మహారాష్ట్ర ప్రభుత్వం",

    processSteps: [
      "మీ అభ్యర్థనను అర్థం చేసుకుంటున్నాము...",
      "ఉద్దేశ్యం మరియు స్థానాన్ని విశ్లేషిస్తున్నాము...",
      "అవసరమైన ప్రభుత్వ సేవలను కనుగొంటున్నాము...",
      "సేవా ఆధారితాలను తనిఖీ చేస్తున్నాము...",
      "మీ ఏకీకృత సేవా ప్రయాణాన్ని నిర్మిస్తున్నాము...",
      "సేవా టైమ్‌లైన్‌ను సిద్ధం చేస్తున్నాము...",
    ],

    quickRequests: [
      "నేను పాస్‌పోర్ట్ కోసం దరఖాస్తు చేయాలనుకుంటున్నాను",
      "నా ఆధార్ కార్డ్ అప్‌డేట్ చేయాలి",
      "నేను పుణేలో రెస్టారెంట్ తెరవాలనుకుంటున్నాను",
      "నాకు డ్రైవింగ్ లైసెన్స్ కావాలి",
      "నేను ఆస్తి నమోదు చేయాలనుకుంటున్నాను",
      "నాకు జనన ధృవీకరణ పత్రం కావాలి",
    ],

    officialGovServices: "అధికారిక ప్రభుత్వ సేవలు",
    govServicesSubtitle: "భారతదేశం అంతటా శాఖల నుండి ఏకీకృత సేవలు 🇮🇳",

    digitalIndiaInitiative: "డిజిటల్ ఇండియా ఇనిషియేటివ్",
    minimumGovernment: "కనీస ప్రభుత్వం, గరిష్ట పాలన",
    bannerDescription: "ONEGOV — అన్ని ప్రభుత్వ సేవలు మీ వేలి కొనలో. ఒక అభ్యర్థన, అనేక సేవలు, ఒక ఏకీకృత ప్రయాణం.",
    makeInIndia: "మేక్ ఇన్ ఇండియా",
    digitalIndia: "డిజిటల్ ఇండియా",
    citizenFirst: "పౌరుడు మొదట",

    language: "భాష",
    english: "English",
    hindi: "हिन्दी",
    marathi: "मराठी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    bengali: "বাংলা",
    gujarati: "ગુજરાતી",
    kannada: "ಕನ್ನಡ",
    malayalam: "മലയാളം",
    punjabi: "ਪੰਜਾਬੀ",

    markAllRead: "అన్నీ చదివినట్లు గుర్తించండి",
    noNotifications: "నోటిఫికేషన్‌లు లేవు",

    personalInfo: "వ్యక్తిగత సమాచారం",
    editProfile: "ప్రొఫైల్ సవరించండి",
    saveChanges: "మార్పులను సేవ్ చేయండి",

    myDocuments: "నా పత్రాలు",
    uploadDocument: "పత్రాన్ని అప్‌లోడ్ చేయండి",
    noDocuments: "ఇంకా పత్రాలు అప్‌లోడ్ చేయబడలేదు",
  },

  bn: {
    appName: "ওয়ানগভ",
    tagline: "সরকারি সেবা, আপনার সাথে সংযুক্ত",
    loading: "লোড হচ্ছে...",
    signIn: "সাইন ইন",
    signOut: "সাইন আউট",
    profile: "প্রোফাইল",
    home: "হোম",
    dashboard: "ড্যাশবোর্ড",
    services: "সেবা",
    settings: "সেটিংস",
    notifications: "বিজ্ঞপ্তি",
    documents: "নথি",
    viewAll: "সব দেখুন",
    newRequest: "নতুন অনুরোধ",
    discover: "আবিষ্কার",
    processing: "প্রক্রিয়াকরণ...",
    total: "মোট",
    completed: "সম্পন্ন",
    inProgress: "চলমান",
    pending: "বিচারাধীন",
    blocked: "ব্লক",
    status: "অবস্থা",
    citizen: "নাগরিক",
    officer: "কর্মকর্তা",
    admin: "প্রশাসক",

    loginTitle: "সাইন ইন",
    loginSubtitle: "সরকারি সেবা, আপনার সাথে সংযুক্ত",
    emailLabel: "ইমেইল ঠিকানা",
    emailPlaceholder: "আপনার ইমেইল লিখুন",
    passwordLabel: "পাসওয়ার্ড",
    passwordPlaceholder: "আপনার পাসওয়ার্ড লিখুন",
    loginButton: "সাইন ইন",
    loginError: "লগইন ব্যর্থ",
    networkError: "নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    demoAccounts: "ডেমো অ্যাকাউন্ট",
    demoDescription: "ক্রেডেনশিয়াল স্বয়ংক্রিয় পূরণ করতে নিচে যেকোনো অ্যাকাউন্টে ক্লিক করুন।",

    heroTitle: "সরকারি সেবা, আপনার সাথে সংযুক্ত।",
    heroSubtitle: "আমাদের বলুন আপনার কী দরকার। ONEGOV প্রয়োজনীয় সেবা আবিষ্কার করে একটি ঐক্যবদ্ধ যাত্রায় আপনাকে পরিচালিত করে।",
    whatToDo: "আপনি কী করতে চান?",
    searchPlaceholder: 'যেমন, "আমি পাসপোর্টের জন্য আবেদন করতে চাই"',
    recentJourneys: "সাম্প্রতিক সেবা যাত্রা",
    totalJourneys: "মোট যাত্রা",
    integratedServices: "সরকারি সেবা",
    integratedServicesSubtitle: "ভারত জুড়ে বিভাগ থেকে সমন্বিত সেবা",
    govFooter: "ভারত সরকার — ডিজিটাল ইন্ডিয়া উদ্যোগ",
    govFooterSub: "ONEGOV স্মার্ট ইন্ডিয়া হ্যাকাথন 2026 প্রোটোটাইপ",
    sihPrototype: "সমস্যা বিবরণ SIH26129 — মহারাষ্ট্র সরকার",

    myJourneys: "আমার সেবা যাত্রা",
    noJourneys: "এখনো কোনো যাত্রা নেই। আপনার প্রথম অনুরোধ শুরু করুন!",
    noJourneysDesc: "আপনার প্রথম সরকারি সেবা অনুরোধ শুরু করুন",
    servicesCount: "সেবা",
    progress: "অগ্রগতি",

    officerDashboard: "কর্মকর্তা ড্যাশবোর্ড",
    officerSubtitle: "নাগরিক সেবা আবেদন পর্যবেক্ষণ এবং পরিচালনা করুন",
    totalApplications: "মোট আবেদন",
    recentApplications: "সাম্প্রতিক আবেদন",
    citizenLabel: "নাগরিক",
    request: "অনুরোধ",

    adminDashboard: "প্রশাসক ড্যাশবোর্ড",
    adminSubtitle: "ONEGOV প্ল্যাটফর্ম পর্যালোচনা — ডিজিটাল ইন্ডিয়া",
    simulationMetrics: "প্রোটোটাইপ সিমুলেশন মেট্রিক্স",
    totalUsers: "মোট ব্যবহারকারী",
    departments: "বিভাগ",
    successRate: "সাফল্যের হার",
    autoRecovered: "স্বয়ংক্রিয় পুনরুদ্ধার",
    integrationHealth: "সমন্বয় স্বাস্থ্য",
    bottleneckAnalysis: "বোতলনেক বিশ্লেষণ",
    noBottlenecks: "কোনো বোতলনেক পাওয়া যায়নি",
    recentActivity: "সাম্প্রতিক কার্যকলাপ",
    digitalIndiaFooter: "ONEGOV — ডিজিটাল ইন্ডিয়া উদ্যোগ — মহারাষ্ট্র সরকার",

    processSteps: [
      "আপনার অনুরোধ বুঝছি...",
      "উদ্দেশ্য এবং অবস্থান বিশ্লেষণ করছি...",
      "প্রয়োজনীয় সরকারি সেবা খুঁজে পাচ্ছি...",
      "সেবা নির্ভরতা পরীক্ষা করছি...",
      "আপনার ঐক্যবদ্ধ সেবা যাত্রা তৈরি করছি...",
      "সেবা টাইমলাইন প্রস্তুত করছি...",
    ],

    quickRequests: [
      "আমি পাসপোর্টের জন্য আবেদন করতে চাই",
      "আমার আধার কার্ড আপডেট করতে হবে",
      "আমি পুনেতে রেস্তোরাঁ খুলতে চাই",
      "আমার ড্রাইভিং লাইসেন্স দরকার",
      "আমি সম্পত্তি নিবন্ধন করতে চাই",
      "আমার জন্ম সনদ দরকার",
    ],

    officialGovServices: "সরকারি সেবা",
    govServicesSubtitle: "ভারত জুড়ে বিভাগ থেকে সমন্বিত সেবা 🇮🇳",

    digitalIndiaInitiative: "ডিজিটাল ইন্ডিয়া উদ্যোগ",
    minimumGovernment: "সর্বনিম্ন সরকার, সর্বোচ্চ শাসন",
    bannerDescription: "ONEGOV — সমস্ত সরকারি সেবা আপনার আঙুলের প্রান্তে। একটি অনুরোধ, একাধিক সেবা, একটি ঐক্যবদ্ধ যাত্রা।",
    makeInIndia: "মেক ইন ইন্ডিয়া",
    digitalIndia: "ডিজিটাল ইন্ডিয়া",
    citizenFirst: "নাগরিক প্রথম",

    language: "ভাষা",
    english: "English",
    hindi: "हिन्दी",
    marathi: "मराठी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    bengali: "বাংলা",
    gujarati: "ગુજરાતી",
    kannada: "ಕನ್ನಡ",
    malayalam: "മലയാളം",
    punjabi: "ਪੰਜਾਬੀ",

    markAllRead: "সব পঠিত চিহ্নিত করুন",
    noNotifications: "কোনো বিজ্ঞপ্তি নেই",

    personalInfo: "ব্যক্তিগত তথ্য",
    editProfile: "প্রোফাইল সম্পাদনা",
    saveChanges: "পরিবর্তন সংরক্ষণ",

    myDocuments: "আমার নথি",
    uploadDocument: "নথি আপলোড",
    noDocuments: "এখনো কোনো নথি আপলোড হয়নি",
  },

  gu: {
    appName: "વનગોવ",
    tagline: "સરકારી સેવાઓ, તમારી સાથે જોડાયેલી",
    loading: "લોડ થઈ રહ્યું છે...",
    signIn: "સાઇન ઇન",
    signOut: "સાઇન આઉટ",
    profile: "પ્રોફાઇલ",
    home: "હોમ",
    dashboard: "ડેશબોર્ડ",
    services: "સેવાઓ",
    settings: "સેટિંગ્સ",
    notifications: "સૂચનાઓ",
    documents: "દસ્તાવેજો",
    viewAll: "બધું જુઓ",
    newRequest: "નવી વિનંતી",
    discover: "શોધો",
    processing: "પ્રક્રિયા...",
    total: "કુલ",
    completed: "પૂર્ણ",
    inProgress: "પ્રગતિમાં",
    pending: "બાકી",
    blocked: "અવરોધાયેલ",
    status: "સ્થિતિ",
    citizen: "નાગરિક",
    officer: "અધિકારી",
    admin: "એડમિન",

    loginTitle: "સાઇન ઇન",
    loginSubtitle: "સરકારી સેવાઓ, તમારી સાથે જોડાયેલી",
    emailLabel: "ઇમેઇલ સરનામું",
    emailPlaceholder: "તમારું ઇમેઇલ દાખલ કરો",
    passwordLabel: "પાસવર્ડ",
    passwordPlaceholder: "તમારો પાસવર્ડ દાખલ કરો",
    loginButton: "સાઇન ઇન",
    loginError: "લૉગિન નિષ્ફળ",
    networkError: "નેટવર્ક ભૂલ. કૃપા કરીને ફરી પ્રયાસ કરો.",
    demoAccounts: "ડેમો એકાઉન્ટ્સ",
    demoDescription: "ક્રેડેન્શિયલ્સ ઑટો-ફિલ કરવા નીચે કોઈપણ એકાઉન્ટ પર ક્લિક કરો.",

    heroTitle: "સરકારી સેવાઓ, તમારી સાથે જોડાયેલી.",
    heroSubtitle: "અમને જણાવો તમને શું જોઈએ છે. ONEGOV જરૂરી સેવાઓ શોધે છે અને તમને એક એકીકૃત યાત્રામાં માર્ગદર્શન આપે છે.",
    whatToDo: "તમે શું કરવા માંગો છો?",
    searchPlaceholder: 'જેમ કે, "હું પાસપોર્ટ માટે અરજી કરવા માંગુ છું"',
    recentJourneys: "તાજેતરની સેવા યાત્રાઓ",
    totalJourneys: "કુલ યાત્રાઓ",
    integratedServices: "સત્તાવાર સરકારી સેવાઓ",
    integratedServicesSubtitle: "ભારતભરમાં વિભાગોમાંથી એકીકૃત સેવાઓ",
    govFooter: "ભારત સરકાર — ડિજિટલ ઇન્ડિયા પહેલ",
    govFooterSub: "ONEGOV સ્માર્ટ ઇન્ડિયા હેકાથોન 2026 પ્રોટોટાઇપ",
    sihPrototype: "સમસ્યા નિવેદન SIH26129 — મહારાષ્ટ્ર સરકાર",

    myJourneys: "મારી સેવા યાત્રાઓ",
    noJourneys: "હજુ સુધી કોઈ યાત્રા નથી. તમારી પ્રથમ વિનંતી શરૂ કરો!",
    noJourneysDesc: "તમારી પ્રથમ સરકારી સેવા વિનંતી શરૂ કરો",
    servicesCount: "સેવાઓ",
    progress: "પ્રગતિ",

    officerDashboard: "અધિકારી ડેશબોર્ડ",
    officerSubtitle: "નાગરિક સેવા અરજીઓનું નિરીક્ષણ અને વ્યવસ્થાપન કરો",
    totalApplications: "કુલ અરજીઓ",
    recentApplications: "તાજેતરની અરજીઓ",
    citizenLabel: "નાગરિક",
    request: "વિનંતી",

    adminDashboard: "એડમિન ડેશબોર્ડ",
    adminSubtitle: "ONEGOV પ્લેટફોર્મ ઝાંખી — ડિજિટલ ઇન્ડિયા",
    simulationMetrics: "પ્રોટોટાઇપ સિમ્યુલેશન મેટ્રિક્સ",
    totalUsers: "કુલ વપરાશકર્તાઓ",
    departments: "વિભાગો",
    successRate: "સફળતા દર",
    autoRecovered: "ઑટો રિકવર",
    integrationHealth: "એકીકરણ આરોગ્ય",
    bottleneckAnalysis: "બોટલનેક વિશ્લેષણ",
    noBottlenecks: "કોઈ બોટલનેક મળ્યા નથી",
    recentActivity: "તાજેતરની પ્રવૃત્તિ",
    digitalIndiaFooter: "ONEGOV — ડિજિટલ ઇન્ડિયા પહેલ — મહારાષ્ટ્ર સરકાર",

    processSteps: [
      "તમારી વિનંતી સમજી રહ્યા છીએ...",
      "હેતુ અને સ્થાનનું વિશ્લેષણ કરી રહ્યા છીએ...",
      "જરૂરી સરકારી સેવાઓ શોધી રહ્યા છીએ...",
      "સેવા નિર્ભરતા તપાસી રહ્યા છીએ...",
      "તમારી એકીકૃત સેવા યાત્રા બનાવી રહ્યા છીએ...",
      "સેવા સમયરેખા તૈયાર કરી રહ્યા છીએ...",
    ],

    quickRequests: [
      "હું પાસપોર્ટ માટે અરજી કરવા માંગુ છું",
      "મારું આધાર કાર્ડ અપડેટ કરવું છે",
      "હું પુણેમાં રેસ્ટોરન્ટ ખોલવા માંગુ છું",
      "મને ડ્રાઇવિંગ લાઇસન્સ જોઈએ છે",
      "હું મિલકત નોંધાવવા માંગુ છું",
      "મને જન્મ પ્રમાણપત્ર જોઈએ છે",
    ],

    officialGovServices: "સત્તાવાર સરકારી સેવાઓ",
    govServicesSubtitle: "ભારતભરમાં વિભાગોમાંથી એકીકૃત સેવાઓ 🇮🇳",

    digitalIndiaInitiative: "ડિજિટલ ઇન્ડિયા પહેલ",
    minimumGovernment: "ન્યૂનતમ સરકાર, મહત્તમ શાસન",
    bannerDescription: "ONEGOV — બધી સરકારી સેવાઓ તમારી આંગળીઓ પર. એક વિનંતી, અનેક સેવાઓ, એક એકીકૃત યાત્રા.",
    makeInIndia: "મેક ઇન ઇન્ડિયા",
    digitalIndia: "ડિજિટલ ઇન્ડિયા",
    citizenFirst: "નાગરિક પ્રથમ",

    language: "ભાષા",
    english: "English",
    hindi: "हिन्दी",
    marathi: "मराठी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    bengali: "বাংলা",
    gujarati: "ગુજરાતી",
    kannada: "ಕನ್ನಡ",
    malayalam: "മലയാളം",
    punjabi: "ਪੰਜਾਬੀ",

    markAllRead: "બધા વાંચેલા ચિહ્નિત કરો",
    noNotifications: "કોઈ સૂચનાઓ નથી",

    personalInfo: "વ્યક્તિગત માહિતી",
    editProfile: "પ્રોફાઇલ સંપાદિત કરો",
    saveChanges: "ફેરફારો સાચવો",

    myDocuments: "મારા દસ્તાવેજો",
    uploadDocument: "દસ્તાવેજ અપલોડ કરો",
    noDocuments: "હજુ સુધી કોઈ દસ્તાવેજ અપલોડ થયા નથી",
  },

  kn: {
    appName: "ವನ್‌ಗೋವ್",
    tagline: "ಸರ್ಕಾರಿ ಸೇವೆಗಳು, ನಿಮ್ಮೊಂದಿಗೆ ಸಂಪರ್ಕಿತ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    signIn: "ಸೈನ್ ಇನ್",
    signOut: "ಸೈನ್ ಔಟ್",
    profile: "ಪ್ರೊಫೈಲ್",
    home: "ಹೋಮ್",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    services: "ಸೇವೆಗಳು",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    documents: "ದಾಖಲೆಗಳು",
    viewAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ",
    newRequest: "ಹೊಸ ವಿನಂತಿ",
    discover: "ಪತ್ತೆಹಚ್ಚಿ",
    processing: "ಪ್ರಕ್ರಿಯೆ...",
    total: "ಒಟ್ಟು",
    completed: "ಪೂರ್ಣ",
    inProgress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    pending: "ಬಾಕಿ",
    blocked: "ನಿರ್ಬಂಧಿತ",
    status: "ಸ್ಥಿತಿ",
    citizen: "ನಾಗರಿಕ",
    officer: "ಅಧಿಕಾರಿ",
    admin: "ಆಡಳಿತ",

    loginTitle: "ಸೈನ್ ಇನ್",
    loginSubtitle: "ಸರ್ಕಾರಿ ಸೇವೆಗಳು, ನಿಮ್ಮೊಂದಿಗೆ ಸಂಪರ್ಕಿತ",
    emailLabel: "ಇಮೇಲ್ ವಿಳಾಸ",
    emailPlaceholder: "ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ",
    passwordLabel: "ಪಾಸ್‌ವರ್ಡ್",
    passwordPlaceholder: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
    loginButton: "ಸೈನ್ ಇನ್",
    loginError: "ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ",
    networkError: "ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    demoAccounts: "ಡೆಮೋ ಖಾತೆಗಳು",
    demoDescription: "ಕ್ರೆಡೆನ್ಷಿಯಲ್ಸ್ ಸ್ವಯಂ-ತುಂಬಿಸಲು ಕೆಳಗೆ ಯಾವುದೇ ಖಾತೆಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ.",

    heroTitle: "ಸರ್ಕಾರಿ ಸೇವೆಗಳು, ನಿಮ್ಮೊಂದಿಗೆ ಸಂಪರ್ಕಿತ.",
    heroSubtitle: "ನಿಮಗೆ ಏನು ಬೇಕು ಎಂದು ನಮಗೆ ತಿಳಿಸಿ. ONEGOV ಅಗತ್ಯ ಸೇವೆಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ ಏಕೀಕೃತ ಪ್ರಯಾಣದಲ್ಲಿ ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.",
    whatToDo: "ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?",
    searchPlaceholder: 'ಉದಾ., "ನಾನು ಪಾಸ್‌ಪೋರ್ಟ್‌ಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಬಯಸುತ್ತೇನೆ"',
    recentJourneys: "ಇತ್ತೀಚಿನ ಸೇವಾ ಪ್ರಯಾಣಗಳು",
    totalJourneys: "ಒಟ್ಟು ಪ್ರಯಾಣಗಳು",
    integratedServices: "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಸೇವೆಗಳು",
    integratedServicesSubtitle: "ಭಾರತದಾದ್ಯಂತ ಇಲಾಖೆಗಳಿಂದ ಏಕೀಕೃತ ಸೇವೆಗಳು",
    govFooter: "ಭಾರತ ಸರ್ಕಾರ — ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ ಉಪಕ್ರಮ",
    govFooterSub: "ONEGOV ಸ್ಮಾರ್ಟ್ ಇಂಡಿಯಾ ಹ್ಯಾಕಥಾನ್ 2026 ಪ್ರೋಟೋಟೈಪ್",
    sihPrototype: "ಸಮಸ್ಯೆ ಹೇಳಿಕೆ SIH26129 — ಮಹಾರಾಷ್ಟ್ರ ಸರ್ಕಾರ",

    myJourneys: "ನನ್ನ ಸೇವಾ ಪ್ರಯಾಣಗಳು",
    noJourneys: "ಇನ್ನೂ ಯಾವುದೇ ಪ್ರಯಾಣಗಳಿಲ್ಲ. ನಿಮ್ಮ ಮೊದಲ ವಿನಂತಿಯನ್ನು ಪ್ರಾರಂಭಿಸಿ!",
    noJourneysDesc: "ನಿಮ್ಮ ಮೊದಲ ಸರ್ಕಾರಿ ಸೇವಾ ವಿನಂತಿಯನ್ನು ಪ್ರಾರಂಭಿಸಿ",
    servicesCount: "ಸೇವೆಗಳು",
    progress: "ಪ್ರಗತಿ",

    officerDashboard: "ಅಧಿಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    officerSubtitle: "ನಾಗರಿಕ ಸೇವಾ ಅರ್ಜಿಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ",
    totalApplications: "ಒಟ್ಟು ಅರ್ಜಿಗಳು",
    recentApplications: "ಇತ್ತೀಚಿನ ಅರ್ಜಿಗಳು",
    citizenLabel: "ನಾಗರಿಕ",
    request: "ವಿನಂತಿ",

    adminDashboard: "ಆಡಳಿತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    adminSubtitle: "ONEGOV ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಅವಲೋಕನ — ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ",
    simulationMetrics: "ಪ್ರೋಟೋಟೈಪ್ ಸಿಮ್ಯುಲೇಷನ್ ಮೆಟ್ರಿಕ್ಸ್",
    totalUsers: "ಒಟ್ಟು ಬಳಕೆದಾರರು",
    departments: "ಇಲಾಖೆಗಳು",
    successRate: "ಯಶಸ್ಸಿನ ದರ",
    autoRecovered: "ಸ್ವಯಂ ಚೇತರಿಕೆ",
    integrationHealth: "ಏಕೀಕರಣ ಆರೋಗ್ಯ",
    bottleneckAnalysis: "ಬೋಟ್ಲ್‌ನೆಕ್ ವಿಶ್ಲೇಷಣೆ",
    noBottlenecks: "ಯಾವುದೇ ಬೋಟ್ಲ್‌ನೆಕ್ ಕಂಡುಬಂದಿಲ್ಲ",
    recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    digitalIndiaFooter: "ONEGOV — ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ ಉಪಕ್ರಮ — ಮಹಾರಾಷ್ಟ್ರ ಸರ್ಕಾರ",

    processSteps: [
      "ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ...",
      "ಉದ್ದೇಶ ಮತ್ತು ಸ್ಥಳವನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದ್ದೇವೆ...",
      "ಅಗತ್ಯ ಸರ್ಕಾರಿ ಸೇವೆಗಳನ್ನು ಪತ್ತೆಹಚ್ಚುತ್ತಿದ್ದೇವೆ...",
      "ಸೇವಾ ಅವಲಂಬನೆಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದೇವೆ...",
      "ನಿಮ್ಮ ಏಕೀಕೃತ ಸೇವಾ ಪ್ರಯಾಣವನ್ನು ನಿರ್ಮಿಸುತ್ತಿದ್ದೇವೆ...",
      "ಸೇವಾ ಸಮಯರೇಖೆಯನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದ್ದೇವೆ...",
    ],

    quickRequests: [
      "ನಾನು ಪಾಸ್‌ಪೋರ್ಟ್‌ಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಬಯಸುತ್ತೇನೆ",
      "ನನ್ನ ಆಧಾರ್ ಕಾರ್ಡ್ ಅಪ್‌ಡೇಟ್ ಮಾಡಬೇಕು",
      "ನಾನು ಪುಣೆಯಲ್ಲಿ ರೆಸ್ಟೋರೆಂಟ್ ತೆರೆಯಲು ಬಯಸುತ್ತೇನೆ",
      "ನನಗೆ ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್ ಬೇಕು",
      "ನಾನು ಆಸ್ತಿ ನೋಂದಣಿ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ",
      "ನನಗೆ ಜನನ ಪ್ರಮಾಣಪತ್ರ ಬೇಕು",
    ],

    officialGovServices: "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಸೇವೆಗಳು",
    govServicesSubtitle: "ಭಾರತದಾದ್ಯಂತ ಇಲಾಖೆಗಳಿಂದ ಏಕೀಕೃತ ಸೇವೆಗಳು 🇮🇳",

    digitalIndiaInitiative: "ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ ಉಪಕ್ರಮ",
    minimumGovernment: "ಕನಿಷ್ಠ ಸರ್ಕಾರ, ಗರಿಷ್ಠ ಆಡಳಿತ",
    bannerDescription: "ONEGOV — ಎಲ್ಲಾ ಸರ್ಕಾರಿ ಸೇವೆಗಳು ನಿಮ್ಮ ಬೆರಳತುದಿಯಲ್ಲಿ. ಒಂದು ವಿನಂತಿ, ಅನೇಕ ಸೇವೆಗಳು, ಒಂದು ಏಕೀಕೃತ ಪ್ರಯಾಣ.",
    makeInIndia: "ಮೇಕ್ ಇನ್ ಇಂಡಿಯಾ",
    digitalIndia: "ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ",
    citizenFirst: "ನಾಗರಿಕ ಮೊದಲು",

    language: "ಭಾಷೆ",
    english: "English",
    hindi: "हिन्दी",
    marathi: "मराठी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    bengali: "বাংলা",
    gujarati: "ગુજરાતી",
    kannada: "ಕನ್ನಡ",
    malayalam: "മലയാളം",
    punjabi: "ਪੰਜਾਬੀ",

    markAllRead: "ಎಲ್ಲವನ್ನೂ ಓದಿದಂತೆ ಗುರುತಿಸಿ",
    noNotifications: "ಯಾವುದೇ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ",

    personalInfo: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",
    editProfile: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
    saveChanges: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",

    myDocuments: "ನನ್ನ ದಾಖಲೆಗಳು",
    uploadDocument: "ದಾಖಲೆ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    noDocuments: "ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆಗಳು ಅಪ್ಲೋಡ್ ಆಗಿಲ್ಲ",
  },

  ml: {
    appName: "വൺഗോവ്",
    tagline: "സർക്കാർ സേവനങ്ങൾ, നിങ്ങളുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു",
    loading: "ലോഡ് ചെയ്യുന്നു...",
    signIn: "സൈൻ ഇൻ",
    signOut: "സൈൻ ഔട്ട്",
    profile: "പ്രൊഫൈൽ",
    home: "ഹോം",
    dashboard: "ഡാഷ്‌ബോർഡ്",
    services: "സേവനങ്ങൾ",
    settings: "സെറ്റിംഗ്സ്",
    notifications: "അറിയിപ്പുകൾ",
    documents: "രേഖകൾ",
    viewAll: "എല്ലാം കാണുക",
    newRequest: "പുതിയ അഭ്യർത്ഥന",
    discover: "കണ്ടെത്തുക",
    processing: "പ്രോസസ്സിംഗ്...",
    total: "മൊത്തം",
    completed: "പൂർത്തിയായി",
    inProgress: "പുരോഗതിയിൽ",
    pending: "തീരുമാനമാകാത്ത",
    blocked: "തടഞ്ഞ",
    status: "സ്ഥിതി",
    citizen: "പൗരൻ",
    officer: "ഉദ്യോഗസ്ഥൻ",
    admin: "അഡ്മിൻ",

    loginTitle: "സൈൻ ഇൻ",
    loginSubtitle: "സർക്കാർ സേവനങ്ങൾ, നിങ്ങളുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു",
    emailLabel: "ഇമെയിൽ വിലാസം",
    emailPlaceholder: "നിങ്ങളുടെ ഇമെയിൽ നൽകുക",
    passwordLabel: "പാസ്‌വേഡ്",
    passwordPlaceholder: "നിങ്ങളുടെ പാസ്‌വേഡ് നൽകുക",
    loginButton: "സൈൻ ഇൻ",
    loginError: "ലോഗിൻ പരാജയപ്പെട്ടു",
    networkError: "നെറ്റ്‌വർക്ക് പിശക്. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    demoAccounts: "ഡെമോ അക്കൗണ്ടുകൾ",
    demoDescription: "ക്രെഡൻഷ്യലുകൾ ഓട്ടോ-ഫിൽ ചെയ്യാൻ താഴെ ഏതെങ്കിലും അക്കൗണ്ട് ക്ലിക്ക് ചെയ്യുക.",

    heroTitle: "സർക്കാർ സേവനങ്ങൾ, നിങ്ങളുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു.",
    heroSubtitle: "നിങ്ങൾക്ക് എന്താണ് വേണ്ടതെന്ന് ഞങ്ങളെ അറിയിക്കുക. ONEGOV ആവശ്യമായ സേവനങ്ങൾ കണ്ടെത്തി ഒരു ഏകീകൃത യാത്രയിൽ നിങ്ങളെ നയിക്കുന്നു.",
    whatToDo: "നിങ്ങൾ എന്താണ് ചെയ്യാൻ ആഗ്രഹിക്കുന്നത്?",
    searchPlaceholder: 'ഉദാ., "എനിക്ക് പാസ്‌പോർട്ടിനായി അപേക്ഷിക്കണം"',
    recentJourneys: "സമീപകാല സേവാ യാത്രകൾ",
    totalJourneys: "മൊത്തം യാത്രകൾ",
    integratedServices: "�ദ്യോഗിക സർക്കാർ സേവനങ്ങൾ",
    integratedServicesSubtitle: "ഇന്ത്യ മുഴുവൻ വകുപ്പുകളിൽ നിന്നുള്ള ഏകീകൃത സേവനങ്ങൾ",
    govFooter: "ഇന്ത്യ സർക്കാർ — ഡിജിറ്റൽ ഇന്ത്യ സംരംഭം",
    govFooterSub: "ONEGOV സ്മാർട്ട് ഇന്ത്യ ഹാക്കത്തോൺ 2026 പ്രോട്ടോടൈപ്പ്",
    sihPrototype: "പ്രശ്ന വിവരണം SIH26129 — മഹാരാഷ്ട്ര സർക്കാർ",

    myJourneys: "എന്റെ സേവാ യാത്രകൾ",
    noJourneys: "ഇതുവരെ യാത്രകൾ ഇല്ല. നിങ്ങളുടെ ആദ്യ അഭ്യർത്ഥന ആരംഭിക്കുക!",
    noJourneysDesc: "നിങ്ങളുടെ ആദ്യ സർക്കാർ സേവാ അഭ്യർത്ഥന ആരംഭിക്കുക",
    servicesCount: "സേവനങ്ങൾ",
    progress: "പുരോഗതി",

    officerDashboard: "ഉദ്യോഗസ്ഥ ഡാഷ്‌ബോർഡ്",
    officerSubtitle: "പൗര സേവാ അപേക്ഷകൾ നിരീക്ഷിക്കുകയും കൈകാര്യം ചെയ്യുകയും ചെയ്യുക",
    totalApplications: "മൊത്തം അപേക്ഷകൾ",
    recentApplications: "സമീപകാല അപേക്ഷകൾ",
    citizenLabel: "പൗരൻ",
    request: "അഭ്യർത്ഥന",

    adminDashboard: "അഡ്മിൻ ഡാഷ്‌ബോർഡ്",
    adminSubtitle: "ONEGOV പ്ലാറ്റ്‌ഫോം അവലോകനം — ഡിജിറ്റൽ ഇന്ത്യ",
    simulationMetrics: "പ്രോട്ടോടൈപ്പ് സിമുലേഷൻ മെട്രിക്സ്",
    totalUsers: "മൊത്തം ഉപയോക്താക്കൾ",
    departments: "വകുപ്പുകൾ",
    successRate: "വിജയ നിരക്ക്",
    autoRecovered: "സ്വയം വീണ്ടെടുക്കൽ",
    integrationHealth: "ഇന്റഗ്രേഷൻ ആരോഗ്യം",
    bottleneckAnalysis: "ബോട്ടിൽനെക്ക് വിശകലനം",
    noBottlenecks: "ബോട്ടിൽനെക്കുകൾ കണ്ടെത്തിയില്ല",
    recentActivity: "സമീപകാല പ്രവർത്തനം",
    digitalIndiaFooter: "ONEGOV — ഡിജിറ്റൽ ഇന്ത്യ സംരംഭം — മഹാരാഷ്ട്ര സർക്കാർ",

    processSteps: [
      "നിങ്ങളുടെ അഭ്യർത്ഥന മനസ്സിലാക്കുന്നു...",
      "ഉദ്ദേശ്യവും സ്ഥലവും വിശകലനം ചെയ്യുന്നു...",
      "ആവശ്യമായ സർക്കാർ സേവനങ്ങൾ കണ്ടെത്തുന്നു...",
      "സേവാ ആശ്രിതത്വങ്ങൾ പരിശോധിക്കുന്നു...",
      "നിങ്ങളുടെ ഏകീകൃത സേവാ യാത്ര നിർമ്മിക്കുന്നു...",
      "സേവാ ടൈംലൈൻ തയ്യാറാക്കുന്നു...",
    ],

    quickRequests: [
      "എനിക്ക് പാസ്‌പോർട്ടിനായി അപേക്ഷിക്കണം",
      "എന്റെ ആധാർ കാർഡ് അപ്‌ഡേറ്റ് ചെയ്യണം",
      "എനിക്ക് പുണെയിൽ റെസ്റ്റോറന്റ് തുറക്കണം",
      "എനിക്ക് ഡ്രൈവിംഗ് ലൈസൻസ് വേണം",
      "എനിക്ക് സ്വത്ത് രജിസ്റ്റർ ചെയ്യണം",
      "എനിക്ക് ജനന സർട്ടിഫിക്കറ്റ് വേണം",
    ],

    officialGovServices: "�ദ്യോഗിക സർക്കാർ സേവനങ്ങൾ",
    govServicesSubtitle: "ഇന്ത്യ മുഴുവൻ വകുപ്പുകളിൽ നിന്നുള്ള ഏകീകൃത സേവനങ്ങൾ 🇮🇳",

    digitalIndiaInitiative: "ഡിജിറ്റൽ ഇന്ത്യ സംരംഭം",
    minimumGovernment: "കുറഞ്ഞ സർക്കാർ, പരമാവധി ഭരണം",
    bannerDescription: "ONEGOV — എല്ലാ സർക്കാർ സേവനങ്ങളും നിങ്ങളുടെ വിരലടയാളത്തിൽ. ഒരു അഭ്യർത്ഥന, നിരവധി സേവനങ്ങൾ, ഒരു ഏകീകൃത യാത്ര.",
    makeInIndia: "മേക്ക് ഇൻ ഇന്ത്യ",
    digitalIndia: "ഡിജിറ്റൽ ഇന്ത്യ",
    citizenFirst: "പൗരൻ ആദ്യം",

    language: "ഭാഷ",
    english: "English",
    hindi: "हिन्दी",
    marathi: "मराठी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    bengali: "বাংলা",
    gujarati: "ગુજરાતી",
    kannada: "ಕನ್ನಡ",
    malayalam: "മലയാളം",
    punjabi: "ਪੰਜਾਬੀ",

    markAllRead: "എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക",
    noNotifications: "അറിയിപ്പുകൾ ഇല്ല",

    personalInfo: "വ്യക്തിഗത വിവരങ്ങൾ",
    editProfile: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക",
    saveChanges: "മാറ്റങ്ങൾ സേവ് ചെയ്യുക",

    myDocuments: "എന്റെ രേഖകൾ",
    uploadDocument: "രേഖ അപ്‌ലോഡ് ചെയ്യുക",
    noDocuments: "ഇതുവരെ രേഖകൾ അപ്‌ലോഡ് ചെയ്തിട്ടില്ല",
  },

  pa: {
    appName: "ਵਨਗੋਵ",
    tagline: "ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ, ਤੁਹਾਡੇ ਨਾਲ ਜੁੜੀਆਂ",
    loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    signIn: "ਸਾਈਨ ਇਨ",
    signOut: "ਸਾਈਨ ਆਊਟ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    home: "ਹੋਮ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    services: "ਸੇਵਾਵਾਂ",
    settings: "ਸੈਟਿੰਗਾਂ",
    notifications: "ਸੂਚਨਾਵਾਂ",
    documents: "ਦਸਤਾਵੇਜ਼",
    viewAll: "ਸਭ ਵੇਖੋ",
    newRequest: "ਨਵੀਂ ਬੇਨਤੀ",
    discover: "ਖੋਜੋ",
    processing: "ਪ੍ਰਕਿਰਿਆ...",
    total: "ਕੁੱਲ",
    completed: "ਪੂਰਾ",
    inProgress: "ਪ੍ਰਗਤੀ ਵਿੱਚ",
    pending: "ਲੰਬਿਤ",
    blocked: "ਰੋਕਿਆ",
    status: "ਸਥਿਤੀ",
    citizen: "ਨਾਗਰਿਕ",
    officer: "ਅਧਿਕਾਰੀ",
    admin: "ਐਡਮਿਨ",

    loginTitle: "ਸਾਈਨ ਇਨ",
    loginSubtitle: "ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ, ਤੁਹਾਡੇ ਨਾਲ ਜੁੜੀਆਂ",
    emailLabel: "ਈਮੇਲ ਪਤਾ",
    emailPlaceholder: "ਆਪਣਾ ਈਮੇਲ ਦਰਜ ਕਰੋ",
    passwordLabel: "ਪਾਸਵਰਡ",
    passwordPlaceholder: "ਆਪਣਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ",
    loginButton: "ਸਾਈਨ ਇਨ",
    loginError: "ਲੌਗਿਨ ਅਸਫਲ",
    networkError: "ਨੈੱਟਵਰਕ ਗਲਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    demoAccounts: "ਡੈਮੋ ਖਾਤੇ",
    demoDescription: "ਕ੍ਰੈਡੈਂਸ਼ੀਅਲ ਆਪਣੇ ਆਪ ਭਰਨ ਲਈ ਹੇਠਾਂ ਕੋਈ ਵੀ ਖਾਤਾ ਕਲਿੱਕ ਕਰੋ।",

    heroTitle: "ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ, ਤੁਹਾਡੇ ਨਾਲ ਜੁੜੀਆਂ।",
    heroSubtitle: "ਸਾਨੂੰ ਦੱਸੋ ਤੁਹਾਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ। ONEGOV ਲੋੜੀਂਦੀਆਂ ਸੇਵਾਵਾਂ ਲੱਭਦਾ ਹੈ ਅਤੇ ਤੁਹਾਨੂੰ ਇੱਕ ਇਕੱਠੀ ਯਾਤਰਾ ਵਿੱਚ ਮਾਰਗਦਰਸ਼ਨ ਕਰਦਾ ਹੈ।",
    whatToDo: "ਤੁਸੀਂ ਕੀ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    searchPlaceholder: 'ਜਿਵੇਂ, "ਮੈਂ ਪਾਸਪੋਰਟ ਲਈ ਅਰਜ਼ੀ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ"',
    recentJourneys: "ਹਾਲੀਆ ਸੇਵਾ ਯਾਤਰਾਵਾਂ",
    totalJourneys: "ਕੁੱਲ ਯਾਤਰਾਵਾਂ",
    integratedServices: "ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ",
    integratedServicesSubtitle: "ਭਾਰਤ ਭਰ ਵਿੱਚ ਮਹਿਕਮਿਆਂ ਤੋਂ ਇਕੱਠੀਆਂ ਸੇਵਾਵਾਂ",
    govFooter: "ਭਾਰਤ ਸਰਕਾਰ — ਡਿਜੀਟਲ ਇੰਡੀਆ ਪਹਿਲ",
    govFooterSub: "ONEGOV ਸਮਾਰਟ ਇੰਡੀਆ ਹੈਕਾਥਾਨ 2026 ਪ੍ਰੋਟੋਟਾਈਪ",
    sihPrototype: "ਸਮੱਸਿਆ ਬਿਆਨ SIH26129 — ਮਹਾਰਾਸ਼ਟਰ ਸਰਕਾਰ",

    myJourneys: "ਮੇਰੀਆਂ ਸੇਵਾ ਯਾਤਰਾਵਾਂ",
    noJourneys: "ਹਜੇ ਤੱਕ ਕੋਈ ਯਾਤਰਾ ਨਹੀਂ। ਆਪਣੀ ਪਹਿਲੀ ਬੇਨਤੀ ਸ਼ੁਰੂ ਕਰੋ!",
    noJourneysDesc: "ਆਪਣੀ ਪਹਿਲੀ ਸਰਕਾਰੀ ਸੇਵਾ ਬੇਨਤੀ ਸ਼ੁਰੂ ਕਰੋ",
    servicesCount: "ਸੇਵਾਵਾਂ",
    progress: "ਪ੍ਰਗਤੀ",

    officerDashboard: "ਅਧਿਕਾਰੀ ਡੈਸ਼ਬੋਰਡ",
    officerSubtitle: "ਨਾਗਰਿਕ ਸੇਵਾ ਅਰਜ਼ੀਆਂ ਦੀ ਨਿਗਰਾਨੀ ਅਤੇ ਪ੍ਰਬੰਧਨ ਕਰੋ",
    totalApplications: "ਕੁੱਲ ਅਰਜ਼ੀਆਂ",
    recentApplications: "ਹਾਲੀਆ ਅਰਜ਼ੀਆਂ",
    citizenLabel: "ਨਾਗਰਿਕ",
    request: "ਬੇਨਤੀ",

    adminDashboard: "ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ",
    adminSubtitle: "ONEGOV ਪਲੇਟਫਾਰਮ ਸਮੀਖਿਆ — ਡਿਜੀਟਲ ਇੰਡੀਆ",
    simulationMetrics: "ਪ੍ਰੋਟੋਟਾਈਪ ਸਿਮੂਲੇਸ਼ਨ ਮੈਟ੍ਰਿਕਸ",
    totalUsers: "ਕੁੱਲ ਵਰਤੋਂਕਾਰ",
    departments: "ਮਹਿਕਮੇ",
    successRate: "ਸਫਲਤਾ ਦਰ",
    autoRecovered: "ਆਟੋ ਰਿਕਵਰ",
    integrationHealth: "ਇੰਟੀਗ੍ਰੇਸ਼ਨ ਸਿਹਤ",
    bottleneckAnalysis: "ਬੋਟਲਨੈੱਕ ਵਿਸ਼ਲੇਸ਼ਣ",
    noBottlenecks: "ਕੋਈ ਬੋਟਲਨੈੱਕ ਨਹੀਂ ਮਿਲਿਆ",
    recentActivity: "ਹਾਲੀਆ ਗਤੀਵਿਧੀ",
    digitalIndiaFooter: "ONEGOV — ਡਿਜੀਟਲ ਇੰਡੀਆ ਪਹਿਲ — ਮਹਾਰਾਸ਼ਟਰ ਸਰਕਾਰ",

    processSteps: [
      "ਤੁਹਾਡੀ ਬੇਨਤੀ ਸਮਝ ਰਹੇ ਹਾਂ...",
      "ਇਰਾਦਾ ਅਤੇ ਟਿਕਾਣਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਹੇ ਹਾਂ...",
      "ਲੋੜੀਂਦੀਆਂ ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ ਲੱਭ ਰਹੇ ਹਾਂ...",
      "ਸੇਵਾ ਨਿਰਭਰਤਾ ਜਾਂਚ ਰਹੇ ਹਾਂ...",
      "ਤੁਹਾਡੀ ਇਕੱਠੀ ਸੇਵਾ ਯਾਤਰਾ ਬਣਾ ਰਹੇ ਹਾਂ...",
      "ਸੇਵਾ ਸਮਾਂਰੇਖਾ ਤਿਆਰ ਕਰ ਰਹੇ ਹਾਂ...",
    ],

    quickRequests: [
      "ਮੈਂ ਪਾਸਪੋਰਟ ਲਈ ਅਰਜ਼ੀ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ",
      "ਮੇਰਾ ਆਧਾਰ ਕਾਰਡ ਅੱਪਡੇਟ ਕਰਨਾ ਹੈ",
      "ਮੈਂ ਪੁਣੇ ਵਿੱਚ ਰੈਸਟੋਰੈਂਟ ਖੋਲ੍ਹਣਾ ਚਾਹੁੰਦਾ ਹਾਂ",
      "ਮੈਨੂੰ ਡ੍ਰਾਈਵਿੰਗ ਲਾਇਸੈਂਸ ਚਾਹੀਦਾ ਹੈ",
      "ਮੈਂ ਜਾਇਦਾਦ ਰਜਿਸਟਰ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ",
      "ਮੈਨੂੰ ਜਨਮ ਸਰਟੀਫਿਕੇਟ ਚਾਹੀਦਾ ਹੈ",
    ],

    officialGovServices: "ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ",
    govServicesSubtitle: "ਭਾਰਤ ਭਰ ਵਿੱਚ ਮਹਿਕਮਿਆਂ ਤੋਂ ਇਕੱਠੀਆਂ ਸੇਵਾਵਾਂ 🇮🇳",

    digitalIndiaInitiative: "ਡਿਜੀਟਲ ਇੰਡੀਆ ਪਹਿਲ",
    minimumGovernment: "ਘੱਟੋ-ਘੱਟ ਸਰਕਾਰ, ਵੱਧ ਤੋਂ ਵੱਧ ਸ਼ਾਸਨ",
    bannerDescription: "ONEGOV — ਸਾਰੀਆਂ ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ ਤੁਹਾਡੀਆਂ ਉਂਗਲਾਂ 'ਤੇ। ਇੱਕ ਬੇਨਤੀ, ਕਈ ਸੇਵਾਵਾਂ, ਇੱਕ ਇਕੱਠੀ ਯਾਤਰਾ।",
    makeInIndia: "ਮੇਕ ਇਨ ਇੰਡੀਆ",
    digitalIndia: "ਡਿਜੀਟਲ ਇੰਡੀਆ",
    citizenFirst: "ਨਾਗਰਿਕ ਪਹਿਲਾਂ",

    language: "ਭਾਸ਼ਾ",
    english: "English",
    hindi: "हिन्दी",
    marathi: "मराठी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    bengali: "বাংলা",
    gujarati: "ગુજરાતી",
    kannada: "ಕನ್ನಡ",
    malayalam: "മലയാളം",
    punjabi: "ਪੰਜਾਬੀ",

    markAllRead: "ਸਭ ਪੜ੍ਹਿਆ ਸ਼ਨਾਖਤ ਕਰੋ",
    noNotifications: "ਕੋਈ ਸੂਚਨਾਵਾਂ ਨਹੀਂ",

    personalInfo: "ਨਿੱਜੀ ਜਾਣਕਾਰੀ",
    editProfile: "ਪ੍ਰੋਫਾਈਲ ਸੰਪਾਦਿਤ ਕਰੋ",
    saveChanges: "ਤਬਦੀਲੀਆਂ ਸੰਭਾਰੋ",

    myDocuments: "ਮੇਰੇ ਦਸਤਾਵੇਜ਼",
    uploadDocument: "ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਕਰੋ",
    noDocuments: "ਹਜੇ ਤੱਕ ਕੋਈ ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਨਹੀਂ ਹੋਏ",
  },
};

export default translations;
