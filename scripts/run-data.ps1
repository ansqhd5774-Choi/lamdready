$ErrorActionPreference='Stop'
Set-Location $PSScriptRoot\..
$runnerNode='C:\Users\c06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $runnerNode scripts/run-data.mjs
if ($LASTEXITCODE -ne 0) { throw 'Runner stopped. Diagnose saved state before retrying.' }
