<?php
// api/forgot_password.php
require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email)) {
    $email = $data->email;

    // 1. Check if user exists
    try {
        $query = "SELECT id FROM users WHERE email = :email";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            // 2. Generate Token
            $token = bin2hex(random_bytes(50));

            // 3. Store in DB
            $insert = "INSERT INTO password_resets (email, token) VALUES (:email, :token)";
            $stmtInsert = $conn->prepare($insert);
            $stmtInsert->bindParam(':email', $email);
            $stmtInsert->bindParam(':token', $token);
            $stmtInsert->execute();

            // 4. Send Email
            // Detect current domain/protocol
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $resetLink = "$protocol://$host/reset_password.html?token=$token";

            $to = $email;
            $subject = "FreeGeny - Password Reset Request";
            $message = "
            <html>
            <head>
            <title>Password Reset</title>
            </head>
            <body>
            <h2>Hello!</h2>
            <p>You requested a password reset for your FreeGeny account.</p>
            <p>Click the link below to reset it:</p>
            <p><a href='$resetLink'>$resetLink</a></p>
            <p>If you did not request this, please ignore this email.</p>
            </body>
            </html>
            ";

            // Headers for HTML email
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            $headers .= 'From: FreeGeny Security <no-reply@freegeny.com>' . "\r\n";

            // Suppress warnings from mail() to avoid corrupting JSON
            if (@mail($to, $subject, $message, $headers)) {
                http_response_code(200);
                echo json_encode(["message" => "Reset link sent to your email."]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to send email. Server mail config might be missing."]);
            }

        } else {
            http_response_code(404);
            echo json_encode(["message" => "Email not found."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }



} else {
    http_response_code(400);
    echo json_encode(["message" => "Email required."]);
}
?>