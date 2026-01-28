# Download Face-API.js Models Script
# This script downloads the required models for face detection

Write-Host "Downloading Face-API.js models..." -ForegroundColor Cyan

# Create models directory
$modelsDir = "public/models"
if (-not (Test-Path $modelsDir)) {
    New-Item -ItemType Directory -Force -Path $modelsDir | Out-Null
    Write-Host "Created directory: $modelsDir" -ForegroundColor Green
}

# Base URL for models
$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

# List of required model files
$models = @(
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_recognition_model-shard2"
)

# Download each model
$successCount = 0
$failCount = 0

foreach ($model in $models) {
    try {
        $url = "$baseUrl/$model"
        $output = "$modelsDir/$model"
        
        Write-Host "Downloading: $model" -ForegroundColor Yellow
        Invoke-WebRequest -Uri $url -OutFile $output -ErrorAction Stop
        Write-Host "  Success!" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "  Failed: $_" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "Download Summary:" -ForegroundColor Cyan
Write-Host "  Successful: $successCount" -ForegroundColor Green
Write-Host "  Failed: $failCount" -ForegroundColor Red

if ($failCount -eq 0) {
    Write-Host ""
    Write-Host "All models downloaded successfully!" -ForegroundColor Green
    Write-Host "You can now use the DniScanner component." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Some models failed to download. Please try again or download manually." -ForegroundColor Yellow
}
