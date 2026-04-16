<?php
/**
 * includes/MailManager.php - Gestionnaire d'emails FreeGeny
 * Version stable sans dépendance externe (mail() natif cPanel)
 */

class MailManager {

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
        $fromName  = $_ENV['SMTP_FROM_NAME']  ?? 'FreeGeny Support';
        $fromEmail = $_ENV['SMTP_FROM_EMAIL'] ?? 'contact@freegeny.com';

        $fullBody = self::buildBody($messageHtml);

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: {$fromName} <{$fromEmail}>\r\n";
        $headers .= "Reply-To: {$fromEmail}\r\n";
        $headers .= "Return-Path: {$fromEmail}\r\n";
        $headers .= "X-Mailer: FreeGeny-PHP/" . phpversion();

        return @mail($to, $subject, $fullBody, $headers, "-f{$fromEmail}");
    }

    public static function sendVerification($to, $userName, $token, $lang = 'fr') {
        $verifyUrl = APP_URL . "/api/auth/verify.php?token=" . $token;

        if ($lang === 'ar') {
            $subject = "قم بتأكيد بريدك الإلكتروني - FreeGeny 🔐";
            $html = "
                <div dir='rtl' style='text-align: right;'>
                    <h1 style='color: #0f172a; font-size: 24px; text-align: center;'>خطوة أخيرة! 🚀</h1>
                    <p>مرحباً <strong>$userName</strong>،</p>
                    <p>لتفعيل وصولك إلى مساحتك، يرجى تأكيد أن هذا البريد الإلكتروني لك.</p>
                    <div style='margin-top: 40px; text-align: center;'>
                        <a href='$verifyUrl' style='display: inline-block; background: #0f172a; color: white; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: bold; font-size: 16px;'>تأكيد بريدي الإلكتروني</a>
                    </div>
                </div>";
        } else {
            $subject = "Confirmez votre adresse email - FreeGeny 🔐";
            $html = "
                <h1 style='color: #0f172a; font-size: 24px; text-align: center;'>Une dernière étape ! 🚀</h1>
                <p>Bonjour <strong>$userName</strong>,</p>
                <p>Pour activer votre accès à FreeGeny, merci de confirmer que cette adresse email est bien la vôtre.</p>
                <div style='margin-top: 40px; text-align: center;'>
                    <a href='$verifyUrl' style='display: inline-block; background: #0f172a; color: white; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: bold; font-size: 16px;'>Confirmer mon email</a>
                </div>";
        }
        return self::send($to, $subject, $html);
    }

    public static function sendWelcome($to, $userName, $lang = 'fr') {
        if ($lang === 'ar') {
            $subject = "مرحباً بك في عالمنا يا $userName ! 🚀";
            $html = "
                <div dir='rtl' style='text-align: right;'>
                    <h1 style='color: #0f172a; font-size: 24px;'>مرحباً ! 🎓</h1>
                    <p>أهلاً <strong>$userName</strong>،</p>
                    <p>نحن سعداء بمرافقتك في نجاح عائلتك.</p>
                    <div style='margin-top: 30px; text-align: center;'>
                        <a href='https://freegeny.com' style='display: inline-block; background: #ea580c; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold;'>ابدأ الآن</a>
                    </div>
                </div>";
        } else {
            $subject = "Bienvenue chez FreeGeny, $userName ! 🚀";
            $html = "
                <h1 style='color: #0f172a; font-size: 24px;'>Bienvenue ! 🎓</h1>
                <p>Bonjour <strong>$userName</strong>,</p>
                <p>Nous sommes ravis de vous accompagner dans la réussite scolaire de votre famille.</p>
                <div style='margin-top: 30px; text-align: center;'>
                    <a href='https://freegeny.com' style='display: inline-block; background: #ea580c; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold;'>Commencer maintenant</a>
                </div>";
        }
        return self::send($to, $subject, $html);
    }

    public static function sendInviteParent($to, $fromName, $parentId) {
        $country     = strtoupper($_SESSION['home_country'] ?? 'DZ');
        $lang        = $_SESSION['lang'] ?? 'fr';
        $subject     = "Invitation : Suivez la réussite de votre famille sur FreeGeny 💎";
        $registerUrl = APP_URL . "/{$country}-{$lang}/auth/register?invite_parent=" . $parentId;

        $html = "
            <h1 style='color: #0f172a; font-size: 24px; text-align: center;'>Une invitation pour vous ! 🤝</h1>
            <p>Bonjour,</p>
            <p><strong>$fromName</strong> vous invite à rejoindre son espace familial sur <strong>FreeGeny</strong>.</p>
            <div style='margin-top: 40px; text-align: center;'>
                <a href='$registerUrl' style='display: inline-block; background: #ea580c; color: white; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: bold; font-size: 16px;'>Rejoindre ma famille</a>
            </div>
            <p style='font-size: 12px; color: #94a3b8; margin-top: 20px;'>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>";

        return self::send($to, $subject, $html);
    }

    public static function sendPasswordReset($to, $userName, $token, $lang = 'fr') {
        $country  = strtoupper($_SESSION['home_country'] ?? 'DZ');
        $resetUrl = APP_URL . "/{$country}-{$lang}/auth/reset-password?token=" . $token;

        if ($lang === 'ar') {
            $subject = "إعادة تعيين كلمة المرور - FreeGeny 🔐";
            $html = "
                <div dir='rtl' style='text-align: right;'>
                    <h1 style='color: #0f172a; font-size: 24px; text-align: center;'>نسيت كلمة المرور؟ 🔑</h1>
                    <p>مرحباً <strong>$userName</strong>،</p>
                    <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.</p>
                    <div style='margin-top: 40px; text-align: center;'>
                        <a href='$resetUrl' style='display: inline-block; background: #0f172a; color: white; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: bold; font-size: 16px;'>تعيين كلمة مرور جديدة</a>
                    </div>
                    <p style='margin-top: 20px; font-size: 14px; color: #64748b;'>هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
                </div>";
        } else {
            $subject = "Réinitialisez votre mot de passe - FreeGeny 🔐";
            $html = "
                <h1 style='color: #0f172a; font-size: 24px; text-align: center;'>Mot de passe oublié ? 🔑</h1>
                <p>Bonjour <strong>$userName</strong>,</p>
                <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Si vous en êtes à l'origine, cliquez sur le bouton ci-dessous :</p>
                <div style='margin-top: 40px; text-align: center;'>
                    <a href='$resetUrl' style='display: inline-block; background: #0f172a; color: white; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: bold; font-size: 16px;'>Réinitialiser mon mot de passe</a>
                </div>
                <p style='margin-top: 20px; font-size: 14px; color: #64748b;'>Ce lien est valable pendant 1 heure seulement.</p>
                <p style='font-size: 12px; color: #94a3b8; margin-top: 20px;'>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>";
        }
        return self::send($to, $subject, $html);
    }
}
