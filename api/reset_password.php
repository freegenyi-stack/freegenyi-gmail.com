<?php
// api/reset_password.php
require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->token) && !empty($data->new_password)) {
    $token = $data->token;
    $new_pass = $data->new_password;

    // 1. Verify Token
    $query = "SELECT email FROM password_resets WHERE token = :token LIMIT 0,1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':token', $token);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $email = $row['email'];

        // 2. Hash New Password
        $hashed_password = password_hash($new_pass, PASSWORD_BCRYPT);

        // 3. Update User Password
        $update = "UPDATE users SET password = :password WHERE email = :email";
        $stmtUpdate = $conn->prepare($update);
        $stmtUpdate->bindParam(':password', $hashed_password);
        $stmtUpdate->bindParam(':email', $email);

        if ($stmtUpdate->execute()) {
            // 4. Delete Token (One-time use)
            $delete = "DELETE FROM password_resets WHERE token = :token";
            $stmtDelete = $conn->prepare($delete);
            $stmtDelete->bindParam(':token', $token);
            $stmtDelete->execute();

            http_response_code(200);
            echo json_encode(["message" => "Password successfully updated."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update password."]);
        }

    } else {
        http_response_code(400); // Invalid request
        echo json_encode(["message" => "Invalid or expired token."]);
    }

} else {
    http_response_code(400);
    echo json_encode(["message" => "Missing token or password."]);
}
?>