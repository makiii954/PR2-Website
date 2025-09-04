<?php
// login.php
session_start();
require_once __DIR__ . '/config.php';

function s($v) { return htmlspecialchars(trim($v), ENT_QUOTES, 'UTF-8'); }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /index.html');
    exit;
}

$input = s($_POST['user'] ?? '');
$password = $_POST['password'] ?? '';

if (!$input || !$password) {
    echo "Missing credentials.<a href='/index.html'>Back</a>";
    exit;
}

// Load users
$users = [];
if (file_exists(USERS_FILE)) {
    $users = json_decode(file_get_contents(USERS_FILE), true) ?: [];
}

// Find user by username or email
$found = null;
foreach ($users as $u) {
    if (strcasecmp($u['username'], $input) === 0 || strcasecmp($u['email'], $input) === 0) {
        $found = $u;
        break;
    }
}

if (!$found) {
    echo "User not found. <a href='/index.html'>Back</a>";
    exit;
}

// Verify password
if (!password_verify($password, $found['password_hash'])) {
    echo "Incorrect password. <a href='/index.html'>Back</a>";
    exit;
}

// Set session
$_SESSION['user'] = [
    'id' => $found['id'],
    'username' => $found['username'],
    'name' => $found['name'],
    'email' => $found['email'],
    'role' => $found['role']
];

// Redirect according to role
if ($found['role'] === 'admin') {
    header('Location: /admin.php');
} else {
    header('Location: /dashboard.php');
}
exit;