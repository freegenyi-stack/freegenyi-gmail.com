<?php
/**
 * FreeGeny - Language Detection API
 * Detects user's language based on IP geolocation
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

function getUserIP()
{
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        return $_SERVER['REMOTE_ADDR'];
    }
}

function detectLanguageFromIP($ip)
{
    // IP to Country mapping using ipapi.co (free tier)
    $apiUrl = "https://ipapi.co/{$ip}/json/";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_USERAGENT, 'FreeGeny/1.0');

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $response) {
        $data = json_decode($response, true);
        if (isset($data['country_code'])) {
            return mapCountryToLanguage($data['country_code']);
        }
    }

    // Fallback to browser language
    return detectBrowserLanguage();
}

function mapCountryToLanguage($countryCode)
{
    // Map country codes to language codes
    $countryLangMap = [
        // Arabic-speaking countries
        'SA' => 'ar',
        'EG' => 'ar',
        'MA' => 'ar',
        'DZ' => 'ar',
        'TN' => 'ar',
        'LY' => 'ar',
        'SD' => 'ar',
        'IQ' => 'ar',
        'SY' => 'ar',
        'JO' => 'ar',
        'LB' => 'ar',
        'AE' => 'ar',
        'KW' => 'ar',
        'OM' => 'ar',
        'QA' => 'ar',
        'BH' => 'ar',
        'YE' => 'ar',
        'PS' => 'ar',

        // French-speaking countries
        'FR' => 'fr',
        'BE' => 'fr',
        'CH' => 'fr',
        'CA' => 'fr',
        'LU' => 'fr',
        'MC' => 'fr',
        'SN' => 'fr',
        'CI' => 'fr',
        'ML' => 'fr',
        'BF' => 'fr',
        'NE' => 'fr',
        'TD' => 'fr',
        'GA' => 'fr',
        'CG' => 'fr',
        'CM' => 'fr',
        'MG' => 'fr',
        'BJ' => 'fr',
        'TG' => 'fr',
        'RW' => 'fr',
        'BI' => 'fr',

        // Spanish-speaking countries
        'ES' => 'es',
        'MX' => 'es',
        'AR' => 'es',
        'CO' => 'es',
        'PE' => 'es',
        'VE' => 'es',
        'CL' => 'es',
        'EC' => 'es',
        'GT' => 'es',
        'CU' => 'es',
        'BO' => 'es',
        'DO' => 'es',
        'HN' => 'es',
        'PY' => 'es',
        'SV' => 'es',
        'NI' => 'es',
        'CR' => 'es',
        'PA' => 'es',
        'UY' => 'es',

        // Portuguese-speaking countries
        'PT' => 'pt',
        'BR' => 'pt',
        'AO' => 'pt',
        'MZ' => 'pt',
        'GW' => 'pt',
        'TL' => 'pt',
        'ST' => 'pt',
        'CV' => 'pt',

        // Chinese-speaking regions
        'CN' => 'zh',
        'TW' => 'zh',
        'HK' => 'yue',
        'MO' => 'yue',
        'SG' => 'zh',

        // Other major languages
        'US' => 'en',
        'GB' => 'en',
        'AU' => 'en',
        'NZ' => 'en',
        'IE' => 'en',
        'ZA' => 'en',
        'IN' => 'hi',
        'PK' => 'ur',
        'BD' => 'bn',
        'ID' => 'id',
        'RU' => 'ru',
        'DE' => 'de',
        'JP' => 'ja',
        'KR' => 'ko',
        'TR' => 'tr',
        'IT' => 'it',
        'NG' => 'pcm',
        'TZ' => 'sw',
        'KE' => 'sw',
        'PH' => 'tl',
        'TH' => 'th',
        'IR' => 'fa',
        'GR' => 'el',
        'RO' => 'ro',
        'HU' => 'hu',
        'CZ' => 'cs',
        'SE' => 'sv',
        'DK' => 'da',
        'FI' => 'fi',
        'NO' => 'no',
    ];

    return $countryLangMap[strtoupper($countryCode)] ?? 'en';
}

function detectBrowserLanguage()
{
    if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
        $supportedLangs = [
            'en',
            'fr',
            'ar',
            'es',
            'zh',
            'bn',
            'pt',
            'ru',
            'id',
            'ur',
            'de',
            'ja',
            'pcm',
            'mr',
            'te',
            'ha',
            'tr',
            'sw',
            'tl',
            'ta',
            'ko',
            'th',
            'it',
            'el',
            'ro',
            'hu',
            'cs',
            'sv',
            'da',
            'fi',
            'no'
        ];
        return in_array($lang, $supportedLangs) ? $lang : 'en';
    }
    return 'en';
}

// Main execution
$ip = getUserIP();
$detectedLang = detectLanguageFromIP($ip);

echo json_encode([
    'success' => true,
    'language' => $detectedLang,
    'ip' => $ip,
    'timestamp' => date('c')
]);
