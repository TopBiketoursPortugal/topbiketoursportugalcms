# PowerShell script to automatically discover and copy used SVG icons
# Searches all .astro and .md files for icon usage

$dest = "src\assets\icons\used"
$srcDir = "src"
$contentDir = "src\content"
$dataDir = "data"

# Icon source directories
$phDir = "src\assets\icons\ph"
$rootDir = "src\assets\icons"

Write-Host "=== Discovering used icons ===" -ForegroundColor Cyan

# Create destination if it doesn't exist
if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
    Write-Host "Created directory: $dest" -ForegroundColor Green
}

# Find all .astro, .md, .mdx files
$files = @()
$files += Get-ChildItem -Path $srcDir -Include *.astro,*.md,*.mdx -Recurse -ErrorAction SilentlyContinue
$files += Get-ChildItem -Path $contentDir -Include *.astro,*.md,*.mdx -Recurse -ErrorAction SilentlyContinue

# Also check data files for icon references (like social.json, languages.json)
$dataFiles = Get-ChildItem -Path $dataDir -Include *.json -Recurse -ErrorAction SilentlyContinue

Write-Host "Scanning $($files.Count) source files and $($dataFiles.Count) data files..." -ForegroundColor Yellow

# Hash set to store unique icon names with their source files
$iconSet = @{}

# Legacy icon mappings from icon.astro
$legacyMappings = @{
    "Envelope" = "envelope-simple-light"
    "User" = "user-light"
    "Bread" = "bread-light"
    "Mug" = "coffee-light"
    "Egg" = "egg-light"
    "Utensils" = "fork-knife-light"
    "Carrot" = "carrot-light"
    "Burger" = "hamburger-light"
    "Fish" = "fish-simple-light"
    "Seedling" = "plant-light"
    "PlateWheat" = "bowl-food-light"
    "PizzaSlice" = "pizza-light"
    "PepperHot" = "pepper-light"
    "ChampagneGlasses" = "wine-light"
    "Check" = "check-light"
    "CircleCheck" = "check-circle-fill"
    "ArrowRight" = "arrow-right-light"
    "ArrowLeft" = "arrow-left-light"
    "ArrowDown" = "arrow-down-light"
    "ArrowUp" = "arrow-up-light"
    "CaretLeft" = "caret-left-light"
    "CaretRight" = "caret-right-light"
    "CaretDown" = "caret-down-light"
    "CaretUp" = "caret-up-light"
    "PaperPlane" = "paper-plane-light"
    "CartShopping" = "shopping-cart-light"
    "Shop" = "storefront-light"
    "BagShopping" = "shopping-bag-light"
    "CreditCard" = "credit-card-light"
    "Store" = "storefront-light"
    "ShopLock" = "lock-light"
    "Car" = "car-light"
    "CircleHalfStroke" = "circle-half-fill"
    "LocationDot" = "map-pin-light"
    "LocationPin" = "map-pin-line-light"
    "LocationCrosshairs" = "crosshair-light"
    "Gift" = "gift-light"
    "House" = "house-light"
    "MagnifyingGlass" = "magnifying-glass-light"
    "Image" = "image-light"
    "Phone" = "phone-light"
    "Bars" = "list-light"
    "Heart" = "heart-light"
    "Xmark" = "x-light"
    "Comment" = "chat-text-light"
    "TruckFast" = "truck-light"
    "FaceSmile" = "smiley-light"
    "Bell" = "bell-light"
    "CalendarDays" = "calendar-light"
    "CircleInfo" = "info-fill"
    "Fire" = "fire-light"
    "Hand" = "hand-light"
    "Lemon" = "orange-light"
    "Bookmark" = "bookmark-simple-light"
    "Facebook" = "facebook-logo-light"
    "Instagram" = "instagram-logo-light"
    "Youtube" = "youtube-logo-light"
    "Google" = "google-logo-light"
    "Tripadvisor" = "tripadvisor"
}

# Add legacy mapped icons
foreach ($mapped in $legacyMappings.Values) {
    if (-not $iconSet.ContainsKey($mapped)) {
        $iconSet[$mapped] = @{
            Family = "ph"
            Files = @("icon.astro (legacy mapping)")
        }
    }
}

# Regex patterns to find icon usage
$patterns = @(
    'icon=["'']([^"'']+)["'']',           # icon="name" or icon='name'
    'icon:\s*["'']([^"'']+)["'']',        # icon: "name" (in YAML/JSON)
    'defaultIcon=["'']([^"'']+)["'']'      # defaultIcon="name"
)

# Search source files
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    
    foreach ($pattern in $patterns) {
        $matches = [regex]::Matches($content, $pattern)
        foreach ($match in $matches) {
            $iconName = $match.Groups[1].Value.Trim()
            
            # Skip empty, invalid names, or common false positives
            if ([string]::IsNullOrWhiteSpace($iconName) -or 
                $iconName -eq "✓" -or 
                $iconName -eq "-" -or
                $iconName -match '^\{' -or           # Skip template variables
                $iconName -match '^icon' -or         # Skip 'icon' or 'iconClass' etc
                $iconName -match 'Class$' -or        # Skip CSS class variables
                $iconName -match '_' -or             # Skip snake_case variables
                $iconName -match '\$' -or            # Skip variables with $
                $iconName.Length -lt 2) {            # Skip single chars
                continue
            }
            
            # Parse icon family prefix
            if ($iconName -match '^(ph|logos|circle-flags|fa):(.+)$') {
                $family = $Matches[1]
                $name = $Matches[2]
                
                if (-not $iconSet.ContainsKey($name)) {
                    $iconSet[$name] = @{
                        Family = $family
                        Files = @()
                    }
                }
                if ($iconSet[$name].Files -notcontains $relativePath) {
                    $iconSet[$name].Files += $relativePath
                }
            } else {
                # No prefix, assume it's a direct filename or legacy name
                if (-not $iconSet.ContainsKey($iconName)) {
                    $iconSet[$iconName] = @{
                        Family = "root"
                        Files = @()
                    }
                }
                if ($iconSet[$iconName].Files -notcontains $relativePath) {
                    $iconSet[$iconName].Files += $relativePath
                }
            }
        }
    }
}

# Search data files
foreach ($file in $dataFiles) {
    $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    
    foreach ($pattern in $patterns) {
        $matches = [regex]::Matches($content, $pattern)
        foreach ($match in $matches) {
            $iconName = $match.Groups[1].Value.Trim()
            
            # Skip invalid names
            if ([string]::IsNullOrWhiteSpace($iconName) -or 
                $iconName -eq "✓" -or 
                $iconName -eq "-" -or
                $iconName -match '^\{' -or
                $iconName -match '^icon' -or
                $iconName -match 'Class$' -or
                $iconName -match '_' -or
                $iconName -match '\$' -or
                $iconName.Length -lt 2) {
                continue
            }
            
            if ($iconName -match '^(ph|logos|circle-flags|fa):(.+)$') {
                $family = $Matches[1]
                $name = $Matches[2]
                
                if (-not $iconSet.ContainsKey($name)) {
                    $iconSet[$name] = @{
                        Family = $family
                        Files = @()
                    }
                }
                if ($iconSet[$name].Files -notcontains $relativePath) {
                    $iconSet[$name].Files += $relativePath
                }
            } else {
                if (-not $iconSet.ContainsKey($iconName)) {
                    $iconSet[$iconName] = @{
                        Family = "root"
                        Files = @()
                    }
                }
                if ($iconSet[$iconName].Files -notcontains $relativePath) {
                    $iconSet[$iconName].Files += $relativePath
                }
            }
        }
    }
}

Write-Host "`nFound $($iconSet.Count) unique icons" -ForegroundColor Green

# Copy icons to destination
$copiedCount = 0
$notFoundIcons = @()

foreach ($iconEntry in $iconSet.GetEnumerator()) {
    $iconName = $iconEntry.Key
    $iconData = $iconEntry.Value
    $family = $iconData.Family
    $sourceFiles = $iconData.Files
    
    # Ensure .svg extension
    if (-not $iconName.EndsWith(".svg")) {
        $iconName = "$iconName.svg"
    }
    
    $found = $false
    
    if ($family -eq "ph") {
        # Recursive search in ph directory (has light/fill subdirs)
        $file = Get-ChildItem -Path $phDir -Filter $iconName -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($file) {
            Copy-Item -Path $file.FullName -Destination (Join-Path $dest $iconName) -Force
            Write-Host "  ✓ Copied $iconName (ph)" -ForegroundColor Gray
            $copiedCount++
            $found = $true
        }
    } else {
        # Direct path for other families
        $sourceDir = ""
        if ($family -eq "root") {
            $sourceDir = $rootDir
        } else {
            $sourceDir = Join-Path $rootDir $family
        }
        
        $sourcePath = Join-Path $sourceDir $iconName
        
        if (Test-Path $sourcePath) {
            Copy-Item -Path $sourcePath -Destination (Join-Path $dest $iconName) -Force
            Write-Host "  ✓ Copied $iconName ($family)" -ForegroundColor Gray
            $copiedCount++
            $found = $true
        }
    }
    
    if (-not $found) {
        $notFoundIcons += @{
            Name = $iconName
            Family = $family
            Files = $sourceFiles
        }
        Write-Warning "  ✗ Icon not found: $iconName (family: $family)"
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Copied: $copiedCount icons" -ForegroundColor Green
if ($notFoundIcons.Count -gt 0) {
    Write-Host "Not found: $($notFoundIcons.Count) icons" -ForegroundColor Yellow
    Write-Host "`n=== Not Found Icons Details ===" -ForegroundColor Yellow
    foreach ($notFound in $notFoundIcons) {
        Write-Host "`nIcon: $($notFound.Name) (family: $($notFound.Family))" -ForegroundColor Yellow
        Write-Host "  Found in files:" -ForegroundColor Gray
        foreach ($file in $notFound.Files) {
            Write-Host "    - $file" -ForegroundColor Gray
        }
    }
}
Write-Host "`nDestination: $dest" -ForegroundColor Cyan
