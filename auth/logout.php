<?php
/**
 * auth/logout.php - Déconnexion sécurisée
 */
session_start();
session_destroy();

// Redirection vers l'accueil (ou login)
header("Location: /DZ-fr/auth/login");
exit;
