<?php
/**
 * scratch/test_email.php - Diagnostic Email SMTP
 */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/MailManager.php';

echo "<h1>Diagnostic Email FreeGeny</h1>";

try {
    echo "Initialisation PHPMailer...<br>";
    require_once __DIR__ . '/../includes/vendor/PHPMailer/Exception.php';
    require_once __DIR__ . '/../includes/vendor/PHPMailer/PHPMailer.php';
    require_once __DIR__ . '/../includes/vendor/PHPMailer/SMTP.php';

    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->SMTPDebug = 2; // Activation debug complet
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'contact@freegeny.com';
    $mail->Password   = 'yeyv xqce nldw jngb';
    $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('contact@freegeny.com', 'FreeGeny Test');
    $mail->addAddress('contact@freegeny.com'); // S'envoyer un mail à soi-même
    
    $mail->isHTML(true);
    $mail->Subject = 'Test Diagnostic SMTP';
    $mail->Body    = 'Ceci est un test de connexion SMTP.';

    echo "<pre>";
    if($mail->send()) {
        echo "\n✅ SUCCESS : L'email SMTP a été envoyé !";
    } else {
        echo "\n❌ FAILURE : L'email n'a pas pu être envoyé.";
    }
    echo "</pre>";

} catch (Exception $e) {
    echo "<h1>❌ ERREUR CATCHÉE :</h1>";
    echo "<pre>" . $e->getMessage() . "</pre>";
}
