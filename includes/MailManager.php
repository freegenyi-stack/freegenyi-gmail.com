<?php
/**
 * MailManager - Gestionnaire pro d'envoi d'emails
 */
class MailManager {
    
    /**
     * Envoie un email au format HTML propre
     */
    public static function send($to, $subject, $messageHtml) {
        $fromName = getenv('SMTP_FROM_NAME') ?: 'FreeGeny';
        $fromEmail = getenv('SMTP_FROM_EMAIL') ?: 'contact@freegeny.com';

        // En-têtes pour un email HTML pro
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: " . $fromName . " <" . $fromEmail . ">" . "\r\n";
        $headers .= "Reply-To: " . $fromEmail . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // Corps de l'email avec un template minimaliste premium
        $fullBody = "
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155; line-height: 1.6; }
                .container { max-width: 600px; margin: 40px auto; padding: 40px; border-radius: 24px; background: #ffffff; border: 1px solid #f1f5f9; }
                .logo { text-align: center; margin-bottom: 40px; }
                .footer { text-align: center; margin-top: 40px; color: #94a3b8; font-size: 12px; }
            </style>
        </head>
        <body style='background-color: #f8fafc;'>
            <div class='container'>
                <div class='logo'>
                    <h2 style='color: #ea580c; font-weight: 900; margin: 0;'>FreeGeny<span style='color: #334155;'>.</span></h2>
                </div>
                $messageHtml
                <div class='footer'>
                    &copy; " . date('Y') . " FreeGeny EdTech. Tous droits réservés.
                </div>
            </div>
        </body>
        </html>
        ";

        return mail($to, $subject, $fullBody, $headers);
    }

    /**
     * Email de Bienvenue
     */
    public static function sendWelcome($to, $userName) {
        $subject = "Bienvenue chez FreeGeny, $userName ! 🚀";
        $html = "
            <h1 style='color: #0f172a; font-size: 24px;'>Bienvenue dans l'aventure ! 🎓</h1>
            <p>Bonjour <strong>$userName</strong>,</p>
            <p>Nous sommes ravis de vous compter parmi nous. FreeGeny est là pour accompagner votre enfant vers la réussite scolaire avec les meilleurs outils EdTech mondiaux.</p>
            <div style='margin-top: 30px;'>
                <a href='https://freegeny.com' style='background: #ea580c; color: white; padding: 14px 28px; border-radius: 14px; text-decoration: none; font-weight: bold; display: inline-block;'>Accéder à mon espace</a>
            </div>
        ";
        return self::send($to, $subject, $html);
    }
}
