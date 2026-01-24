<?php
session_start();

// CONFIGURATION
$SITE_PASSWORD = "futureisnow"; // Mot de passe pour accéder au site

if (isset($_POST['password'])) {
    if ($_POST['password'] === $SITE_PASSWORD) {
        $_SESSION['site_unlocked'] = true;
    } else {
        $error = "Mot de passe incorrect";
    }
}

if (isset($_SESSION['site_unlocked']) && $_SESSION['site_unlocked'] === true) {
    // L'utilisateur est autorisé, on affiche le site principal
    readfile("home.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accès Restreint - FreeGeny</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Nunito', sans-serif;
            background: #F8FAFC;
            background-image:
                radial-gradient(circle at 10% 20%, rgba(9, 161, 161, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(211, 150, 166, 0.1) 0%, transparent 40%);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            color: #0F172A;
        }

        .lock-card {
            background: white;
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .logo {
            font-size: 32px;
            font-weight: 900;
            background: linear-gradient(135deg, #09A1A1, #D396A6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
            display: inline-block;
        }

        input[type="password"] {
            width: 100%;
            padding: 15px;
            border: 2px solid #E2E8F0;
            border-radius: 12px;
            margin-bottom: 20px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.3s;
        }

        input[type="password"]:focus {
            border-color: #09A1A1;
        }

        button {
            width: 100%;
            padding: 15px;
            background: #09A1A1;
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.2s, background 0.2s;
        }

        button:hover {
            background: #078585;
            transform: translateY(-2px);
        }

        .error {
            color: #EF4444;
            margin-bottom: 15px;
            font-size: 14px;
            font-weight: 600;
        }

        p {
            color: #64748B;
            margin-bottom: 30px;
            line-height: 1.5;
        }
    </style>
</head>

<body>
    <div class="lock-card">
        <div class="logo">FreeGeny</div>
        <p>Ce site est actuellement en accès privé pour le développement.</p>

        <?php if (isset($error)): ?>
            <div class="error">
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <form method="POST">
            <input type="password" name="password" placeholder="Mot de passe d'accès" required autofocus>
            <button type="submit">Entrer</button>
        </form>
    </div>
</body>

</html>