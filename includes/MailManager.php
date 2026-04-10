<?php
/**
 * MailManager - Gestionnaire pro d'envoi d'emails
 */
class MailManager {
    
    public static function send($to, $subject, $messageHtml) {
        // Utiliser $_ENV ou les valeurs par défaut
        $fromName = $_ENV['SMTP_FROM_NAME'] ?? 'FreeGeny Support';
        $fromEmail = $_ENV['SMTP_FROM_EMAIL'] ?? 'contact@freegeny.com';

        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: " . $fromName . " <" . $fromEmail . ">" . "\r\n";
        $headers .= "Reply-To: " . $fromEmail . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        $fullBody = "
        <html>
        <body style='background-color: #f8fafc; font-family: sans-serif; padding: 40px;'>
            <div style='max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid #f1f5f9; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);'>
                <div style='text-align: center; margin-bottom: 30px;'>
                    <h2 style='color: #ea580c; font-weight: 900; margin: 0; font-size: 28px;'>FreeGeny</h2>
                </div>
                <div style='color: #334155; line-height: 1.6; font-size: 16px;'>
                    $messageHtml
                </div>
                <div style='text-align: center; margin-top: 40px; color: #94a3b8; font-size: 12px;'>
                    &copy; " . date('Y') . " FreeGeny EdTech.
                </div>
            </div>
        </body>
        </html>
        ";

        // Sur certains serveurs, mail() peut échouer. On met un @ pour ne pas bloquer l'inscription avec une erreur 500.
        return @mail($to, $subject, $fullBody, $headers);
    }

    public static function sendWelcome($to, $userName) {
        $subject = "Bienvenue chez FreeGeny, $userName ! 🚀";
        $html = "
            <h1 style='color: #0f172a; font-size: 24px;'>Bienvenue ! 🎓</h1>
            <p>Bonjour <strong>$userName</strong>,</p>
            <p>Nous sommes ravis de vous accompagner dans la réussite scolaire de votre famille.</p>
            <div style='margin-top: 30px; text-align: center;'>
                <a href='https://freegeny.com' style='background: #ea580c; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold;'>Commencer maintenant</a>
            </div>
        ";
        return self::send($to, $subject, $html);
    }
}
