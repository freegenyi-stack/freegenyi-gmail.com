# Script PowerShell - Copie des JSONs vers apps/web-php/data/
# Executer depuis la RACINE du projet : .\apps\web-php\install\copy-json-data.ps1

param(
    [string]$ProjectRoot = (Get-Location).Path
)

Write-Host "FreeGeny -- Copie des JSONs vers web-php/data/" -ForegroundColor Cyan
Write-Host "   Projet root : $ProjectRoot" -ForegroundColor Gray

$sourceBase = Join-Path $ProjectRoot "Documentation_Programs_Contry\ar\algeria\1_ap"
$destBase   = Join-Path $ProjectRoot "data\algeria\1ap"

$matieres = @(
    @{ Name = "arabe";         Source = "arabe\output";         Prefix = "arabe_1ap" },
    @{ Name = "mathematiques"; Source = "mathematiques\output"; Prefix = "maths_1ap" }
)

$filesToCopy = @(
    "presentation",
    "curriculum_map",
    "cours",
    "exercices",
    "revisions",
    "examens",
    "competences",
    "games_config",
    "contenu_parents",
    "dashboard_config",
    "config_pays",
    "progress_schema",
    "media_manifest",
    "international",
    "courses_mobile"
)

$totalCopied = 0
$totalSize   = 0

foreach ($matiere in $matieres) {
    $srcDir  = Join-Path $sourceBase $matiere.Source
    $destDir = Join-Path $destBase $matiere.Name

    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        Write-Host "  [CREATED] $destDir" -ForegroundColor Green
    }

    Write-Host "" 
    Write-Host "Matiere : $($matiere.Name)" -ForegroundColor Yellow

    foreach ($fileBase in $filesToCopy) {
        $fileName = "${fileBase}_$($matiere.Prefix)_latest.json"
        $srcFile  = Join-Path $srcDir $fileName
        $destFile = Join-Path $destDir $fileName

        if (Test-Path $srcFile) {
            Copy-Item -Path $srcFile -Destination $destFile -Force
            $size = (Get-Item $srcFile).Length
            $sizeKb = [math]::Round($size / 1024, 1)
            $totalSize += $size
            $totalCopied++
            Write-Host "    [OK] $fileName ($sizeKb Ko)" -ForegroundColor Green
        } else {
            Write-Host "    [SKIP] Not found: $fileName" -ForegroundColor Yellow
        }
    }
}

$totalSizeMb = [math]::Round($totalSize / 1024 / 1024, 1)
Write-Host ""
Write-Host "Termine ! $totalCopied fichiers copies ($totalSizeMb Mo)" -ForegroundColor Cyan
Write-Host "Destination : $destBase" -ForegroundColor Gray
