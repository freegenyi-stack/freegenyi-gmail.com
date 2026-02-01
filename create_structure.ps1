$structure = @{
    "en" = @("usa", "uk", "canada", "australia", "india", "new_zealand", "south_africa")
    "fr" = @("france", "belgium", "canada_qc", "switzerland", "senegal", "morocco", "tunisia", "algeria")
    "ar" = @("tunisia", "egypt", "saudi_arabia", "uae", "morocco", "algeria", "qatar", "kuwait")
    "es" = @("spain", "mexico", "argentina", "colombia", "chile", "peru")
    "zh" = @("china", "singapore", "taiwan")
    "pt" = @("portugal", "brazil", "angola")
    "de" = @("germany", "austria", "switzerland")
    "it" = @("italy")
    "ru" = @("russia", "belarus")
    "ja" = @("japan")
    "ko" = @("south_korea")
    "hi" = @("india")
    "tr" = @("turkey")
    "vi" = @("vietnam")
    "pl" = @("poland")
    "nl" = @("netherlands", "belgium")
    "id" = @("indonesia")
    "th" = @("thailand")
    "sv" = @("sweden")
    "da" = @("denmark")
    "no" = @("norway")
    "fi" = @("finland")
    "el" = @("greece")
    "cs" = @("czech_republic")
    "ro" = @("romania")
    "hu" = @("hungary")
    "he" = @("israel")
    "uk_ua" = @("ukraine") # using uk_ua to avoid conflict with uk country code
    "ms" = @("malaysia")
    "fa" = @("iran")
}

$root = "c:\Users\Yousr\freegonya\programs"

foreach ($lang in $structure.Keys) {
    $langPath = Join-Path $root $lang
    if (!(Test-Path $langPath)) {
        New-Item -ItemType Directory -Force -Path $langPath | Out-Null
        Write-Host "Created Language: $lang"
    }
    
    foreach ($country in $structure[$lang]) {
        $countryPath = Join-Path $langPath $country
        if (!(Test-Path $countryPath)) {
            New-Item -ItemType Directory -Force -Path $countryPath | Out-Null
            Write-Host "  -> Created Country: $country"
        }
    }
}
Write-Host "Done!"
