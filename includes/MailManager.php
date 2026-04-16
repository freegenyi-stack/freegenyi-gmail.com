<?php
/**
 * includes/MailManager.php - Gestionnaire d'emails FreeGeny Elite
 * Utilise PHPMailer pour un envoi SMTP authentifié (meilleure délivrabilité)
 */

class MailManager {

    private static function getMailer() {
        require_once __DIR__ . '/vendor/PHPMailer/Exception.php';
        require_once __DIR__ . '/vendor/PHPMailer/PHPMailer.php';
        require_once __DIR__ . '/vendor/PHPMailer/SMTP.php';

        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
        
        try {
            // Configuration Serveur (LOCAL SMTP - Only working method on Ayrade)
            $mail->isSMTP();
            $mail->Host       = 'localhost';
            $mail->SMTPAuth   = false;
            $mail->Username   = 'contact@freegeny.com';
            $mail->Password   = ''; 
            $mail->SMTPSecure = '';
            $mail->Port       = 25;
            $mail->CharSet    = 'UTF-8';

            // Destinateur
            $fromEmail = 'contact@freegeny.com';
            $fromName  = 'FreeGeny Elite';
            $mail->setFrom($fromEmail, $fromName);
            $mail->isHTML(true);

            return $mail;
        } catch (Exception $e) {
            return null;
        }
    }

    private static function buildBody($messageHtml) {
        return "
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
        </html>";
    }

    public static function send($to, $subject, $messageHtml) {
        $mail = self::getMailer();
        
        if (!$mail) {
            // Backup : mail() natif si PHPMailer échoue
            $fromName  = 'FreeGeny Elite';
            $fromEmail = 'contact@freegeny.com';
            $fullBody = self::buildBody($messageHtml);
            $headers  = "MIME-Version: 1.0\r\nContent-type: text/html; charset=UTF-8\r\n";
            $headers .= "From: {$fromName} <{$fromEmail}>\r\n";
            return @mail($to, $subject, $fullBody, $headers, "-f{$fromEmail}");
        }

        try {
            $mail->addAddress($to);
            $mail->Subject = $subject;
            $mail->Body    = self::buildBody($messageHtml);
            return $mail->send();
        } catch (Exception $e) {
            return false;
        }
    }

    public static function sendVerification($to, $userName, $token, $lang = 'fr') {
        $verifyUrl = APP_URL . "/api/auth/verify.php?token=" . $token;

        if ($lang === 'ar') {
            $subject = "تأكيد حسابك - FreeGeny";
            $html = "
                <div dir='rtl' style='text-align: right;'>
                    <h1 style='color: #0f172a; font-size: 24px; text-align: center;'>خطوة أخيرة!</h1>
                    <p>مرحباً <strong>$userName</strong>،</p>
                    <p>لتفعيل وصولك إلى مساحتك، يرجى تأكيد أن هذا البريد الإلكتروني لك.</p>
                    <div style='margin-top: 40px; text-align: center;'>
                        <a href='$verifyUrl' style='display: inline-block; background: #0f172a; color: white; padding: 18px 36px; border-radius: 12px; text-decoration: none; font-weight: bold;'>تأكيد بريدي الإلكتروني</a>
                    </div>
                </div>";
        } else {
            $subject = "Confirmez votre adresse email - FreeGeny";
            $html = "
                <h1 style='color: #0f172a; font-size: 24px; text-align: center;'>Une dernière étape !</h1>
                <p>Bonjour <strong>$userName</strong>,</p>
                <p>Pour activer votre accès à FreeGeny, merci de confirmer que cette adresse email est bien la vôtre.</p>
                <div style='margin-top: 40px; text-align: center;'>
                    <a href='$verifyUrl' style='display: inline-block; background: #0f172a; color: white; padding: 18px 36px; border-radius: 12px; text-decoration: none; font-weight: bold;'>Confirmer mon email</a>
                </div>";
        }
        return self::send($to, $subject, $html);
    }

    public static function sendWelcome($to, $userName, $lang = 'fr') {
        if ($lang === 'ar') {
            $subject = "مرحباً بك في FreeGeny";
            $html = "
                <div dir='rtl' style='text-align: right;'>
                    <h1 style='color: #0f172a; font-size: 24px;'>مرحباً !</h1>
                    <p>أهلاً <strong>$userName</strong>،</p>
                    <p>نحن سعداء بمرافقتك في نجاح عائلتك.</p>
                </div>";
        } else {
            $subject = "Bienvenue chez FreeGeny";
            $html = "
                <h1 style='color: #0f172a; font-size: 24px;'>Bienvenue !</h1>
                <p>Bonjour <strong>$userName</strong>,</p>
                <p>Nous sommes ravis de vous accompagner dans la réussite scolaire de votre famille.</p>";
        }
        return self::send($to, $subject, $html);
    }

    public static function sendInviteParent($to, $fromName, $parentId) {
        $country     = strtoupper($_SESSION['home_country'] ?? 'DZ');
        $lang        = $_SESSION['lang'] ?? 'fr';
        $subject     = "Invitation : Rejoignez votre espace familial FreeGeny";
        $registerUrl = APP_URL . "/{$country}-{$lang}/auth/register?invite_parent=" . $parentId;

        $html = "
            <h1 style='color: #0f172a; font-size: 24px; text-align: center;'>Une invitation pour vous</h1>
            <p>Bonjour,</p>
            <p><strong>$fromName</strong> vous invite à rejoindre son espace familial sur <strong>FreeGeny</strong>.</p>
            <div style='margin-top: 40px; text-align: center;'>
                <a href='$registerUrl' style='display: inline-block; background: #ea580c; color: white; padding: 18px 36px; border-radius: 12px; text-decoration: none; font-weight: bold;'>Rejoindre ma famille</a>
            </div>";

        return self::send($to, $subject, $html);
    }

    public static function sendPasswordReset($to, $userName, $token, $lang = 'fr') {
        $country  = strtoupper($_SESSION['home_country'] ?? 'DZ');
        $resetUrl = APP_URL . "/{$country}-{$lang}/auth/reset-password?token=" . $token;

        if ($lang === 'ar') {
            $subject = "إعادة تعيين كلمة المرور - FreeGeny";
            $html = "
                <div dir='rtl' style='text-align: right;'>
                    <h1 style='color: #0f172a; font-size: 24px; text-align: center;'>إعادة تعيين كلمة المرور</h1>
                    <p>مرحباً <strong>$userName</strong>،</p>
                    <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.</p>
                    <div style='margin-top: 30px; text-align: center;'>
                        <a href='$resetUrl' style='display: inline-block; background: #0f172a; color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold;'>تعيين كلمة مرور جديدة</a>
                    </div>
                    <p style='margin-top: 20px; font-size: 13px; color: #64748b;'>هذا الرابط صالح لمدة ساعة واحدة.</p>
                </div>";
        } else {
            $subject = "Reinitialisation de votre mot de passe - FreeGeny";
            $html = "
                <h1 style='color: #0f172a; font-size: 24px; text-align: center;'>Mot de passe perdu ?</h1>
                <p>Bonjour <strong>$userName</strong>,</p>
                <p>Une demande de reinitialisation de mot de passe a été effectuée. Cliquez sur le bouton ci-dessous pour continuer :</p>
                <div style='margin-top: 30px; text-align: center;'>
                    <a href='$resetUrl' style='display: inline-block; background: #0f172a; color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold;'>Changer mon mot de passe</a>
                </div>
                <p style='margin-top: 20px; font-size: 13px; color: #64748b;'>Ce lien est valable pendant 1 heure.</p>";
        }
        return self::send($to, $subject, $html);
    }
}
