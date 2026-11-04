# Define the directory containing the .md files
$directoryPath = "C:\personal\topbiketoursportugalcmsVNEW\src\content\testimonials"

# Get all .md files in the directory
$mdFiles = Get-ChildItem -Path $directoryPath -Filter *.mdx

foreach ($file in $mdFiles) {
    $content = Get-Content -Path $file.FullName
    $headerStart = [array]::IndexOf($content, "---")
    $headerEnd = [array]::IndexOf($content, "---", $headerStart + 1)

    # Check if the file has a valid TOML header
    if ($headerStart -ne -1 -and $headerEnd -ne -1) {
        $header = $content[$headerStart..$headerEnd]

        # Check if the header already contains an 'id:' field
        $idExists = $header | Where-Object { $_ -match '^id:\s*' }

        if (-not $idExists) {
            # Generate a new GUID
            $newGuid = [guid]::NewGuid().ToString()

            # Insert the new 'id:' field at the second line of the file
            $newContent = @($content[0]) + @("id: $newGuid") + $content[1..($content.Length - 1)]

            # Write the modified content back to the file
            $newContent | Set-Content -Path $file.FullName

            Write-Host "Added 'id: $newGuid' to $($file.Name)"
        } else {
            Write-Host "Skipped $($file.Name) - 'id:' field already exists"
        }
    } else {
        Write-Host "Skipped $($file.Name) - No valid TOML header found"
    }
}