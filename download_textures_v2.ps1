$baseUrl = "https://www.solarsystemscope.com/textures/download"
$dest = "d:\Github Projects\Living Earth\src\assets\textures"

# Textures to download
$files = @{
    "8k_earth_daymap.jpg" = "earth_daymap_8k.jpg"
    "8k_earth_normal_map.jpg" = "earth_normal_8k.jpg"
    "8k_earth_specular_map.jpg" = "earth_specular_8k.jpg"
    "8k_earth_clouds.jpg" = "earth_clouds_8k.jpg"
}

foreach ($key in $files.Keys) {
    $url = "$baseUrl/$key"
    $output = "$dest/$($files[$key])"
    
    if (Test-Path $output) {
        Write-Host "$output already exists. Skipping."
        continue
    }

    Write-Host "Downloading $key to $output..."
    
    # Try using curl.exe (best for binary downloads)
    try {
        & curl.exe -L -o $output $url --user-agent "Mozilla/5.0"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Success with curl.exe"
            continue
        }
    } catch {
        Write-Host "curl.exe failed or not found. Falling back to Invoke-WebRequest."
    }

    # Fallback to Invoke-WebRequest
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -TimeoutSec 60
        Write-Host "Success with Invoke-WebRequest."
    } catch {
        Write-Host "Failed to download $key : $_"
    }
}
