$ErrorActionPreference = "SilentlyContinue"
$p = Start-Process -FilePath 'node.exe' -ArgumentList 'node_modules\next\dist\bin\next','dev','-p','3000' -WorkingDirectory 'D:\Projects Drive\OneGov\onegov' -RedirectStandardOutput 'D:\Projects Drive\OneGov\.freebuff\preview-9017f044-bcd3-4868-9941-3b9da8983614.log' -RedirectStandardError 'D:\Projects Drive\OneGov\.freebuff\preview-9017f044-bcd3-4868-9941-3b9da8983614.log.err' -WindowStyle Hidden -PassThru
Write-Output $p.Id
