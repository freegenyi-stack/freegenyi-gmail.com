<?php
require_once __DIR__ . '/config/app.php';

// Envoyer les headers XML
header("Content-Type: application/xml; charset=utf-8");

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' . "\n";

// Pages publiques à indexer (sans auth ni dashboard)
$pages = [
    '/',
    '/about',
    '/mission',
    '/approach',
    '/science',
    '/parents',
    '/schools',
    '/ngos',
    '/faq',
    '/contact',
];

// Date de dernière modification = aujourd'hui (simplifié)
$lastmod = date('Y-m-d');

foreach ($pages as $page) {
    foreach ($supported_regions as $cCode => $info) {
        foreach ($info['langs'] as $lCode) {
            $url = APP_URL . '/' . $cCode . '-' . $lCode . ($page === '/' ? '/' : $page);
            
            echo "  <url>\n";
            echo "    <loc>" . htmlspecialchars($url) . "</loc>\n";
            echo "    <lastmod>{$lastmod}</lastmod>\n";
            echo "    <changefreq>weekly</changefreq>\n";
            echo "    <priority>" . ($page === '/' ? '1.0' : '0.8') . "</priority>\n";
            
            // Hreflang pour sitemap
            foreach ($supported_regions as $altCCode => $altInfo) {
                foreach ($altInfo['langs'] as $altLCode) {
                    $altUrl = APP_URL . '/' . $altCCode . '-' . $altLCode . ($page === '/' ? '/' : $page);
                    echo '    <xhtml:link rel="alternate" hreflang="' . strtolower($altLCode) . '-' . strtolower($altCCode) . '" href="' . htmlspecialchars($altUrl) . '" />' . "\n";
                }
            }
            
            echo "  </url>\n";
        }
    }
}

echo '</urlset>';
?>
