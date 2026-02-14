$baseUrl = "https://www.solarsystemscope.com/textures/download"
$dest = "d:\Github Projects\Living Earth\src\assets\textures"

# Backup old textures
Get-ChildItem $dest | ForEach-Object {
    if ($_.Name -notlike "*_old*") {
        Copy-Item $_.FullName "$($_.FullName).old" -Force
    }
}

# Download new textures
$files = @{
    "8k_earth_daymap.jpg" = "earth_daymap.jpg"
    "8k_earth_normal_map.jpg" = "earth_normal.jpg"
    "8k_earth_specular_map.jpg" = "earth_specular.jpg"
    "8k_earth_clouds.jpg" = "earth_clouds.jpg" 
}

foreach ($key in $files.Keys) {
    $url = "$baseUrl/$key"
    $output = "$dest/$($files[$key])"
    Write-Host "Downloading $key to $output..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -UserAgent "Mozilla/5.0"
        Write-Host "Success."
    } catch {
        Write-Host "Failed to download $key : $_"
    }
}
