$templatePath = "src/index.html"
$componentsDir = "src/components"
$outputPath = "index.html"

if (!(Test-Path $templatePath)) {
    Write-Error "Template not found: $templatePath"
    exit
}

$template = Get-Content -Raw -Path $templatePath -Encoding UTF8

# Regex to find <!-- include:component_name -->
$regex = [regex]'<!--\s*include:([a-zA-Z0-9_\-]+)\s*-->'

$matches = $regex.Matches($template)

foreach ($match in $matches) {
    $tagName = $match.Value
    $componentName = $match.Groups[1].Value
    $componentPath = Join-Path $componentsDir "$componentName.html"
    
    if (Test-Path $componentPath) {
        $componentContent = Get-Content -Raw -Path $componentPath -Encoding UTF8
        $template = $template.Replace($tagName, $componentContent)
        Write-Host "  -> Injecting component: $componentName"
    } else {
        Write-Warning "Component file not found: $componentPath"
    }
}

# Clean line endings to match node output (optional, but good practice)
$template = $template -replace "`r`n", "`n"

Set-Content -Path $outputPath -Value $template -Encoding UTF8
Write-Host "Build completed successfully!"
