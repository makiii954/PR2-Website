<?php
// register.php
session_start();
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/sendemail.php';

// Helper: sanitize
function s($v) {
    return htmlspecialchars(trim($v), ENT_QUOTES, 'UTF-8');
}

// Ensure POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /signup.html');
    exit;
}

$name = s($_POST['name'] ?? '');
$email = s($_POST['email'] ?? '');
$dob = s($_POST['dob'] ?? '');
$username = s($_POST['username'] ?? '');
$password = $_POST['password'] ?? ''; // don't sanitize password here

// Basic validation
$errors = [];
if (!$name) $errors[] = "Name is required.";
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required.";
if (!$dob) $errors[] = "Date of birth is required.";
if (!$username) $errors[] = "Username is required.";
if (strlen($password) < 6) $errors[] = "Password must be at least 6 characters.";

if ($errors) {
    echo "<h3>Registration error</h3><ul>";
    foreach ($errors as $e) echo "<li>" . $e . "</li>";
    echo "</ul><p><a href='/signup.html'>Go back</a></p>";
    exit;
}

// Load existing users or create empty array
$users = [];
if (file_exists(USERS_FILE)) {
    $json = file_get_contents(USERS_FILE);
    $users = json_decode($json, true) ?: [];
}

// Check for existing username or email
foreach ($users as $u) {
    if (strcasecmp($u['username'], $username) === 0) {
        echo "Username already taken. <a href='/signup.html'>Back</a>";
        exit;
    }
    if (strcasecmp($u['email'], $email) === 0) {
        echo "Email already registered. <a href='/signup.html'>Back</a>";
        exit;
    }
}

// Hash password
$pass_hash = password_hash($password, PASSWORD_DEFAULT);

// Create user record
$user = [
    'id' => uniqid('u_', true),
    'name' => $name,
    'email' => $email,
    'dob' => $dob,
    'username' => $username,
    'password_hash' => $pass_hash,
    'role' => 'user', // default role
    'created_at' => date('c')
];

// Append and save users.json (with locking)
$users[] = $user;
$fp = fopen(USERS_FILE, 'c+');
if (flock($fp, LOCK_EX)) {
    ftruncate($fp, 0);
    fwrite($fp, json_encode($users, JSON_PRETTY_PRINT));
    fflush($fp);
    flock($fp, LOCK_UN);
}
fclose($fp);

// Append backup to userdata.txt
$backup = sprintf(
    "Name: %s | Email: %s | DOB: %s | Username: %s | Created: %s\n",
    $name, $email, $dob, $username, date('Y-m-d H:i:s')
);
file_put_contents(USERDATA_TXT, $backup, FILE_APPEND | LOCK_EX);

// Send email to owner
$subject = "New User Registered: " . $name;
$message = "A new user has registered on your website.\n\n".
           "Name: $name\n".
           "Email: $email\n".
           "DOB: $dob\n".
           "Username: $username\n".
           "Registered at: " . date('Y-m-d H:i:s') . "\n\n".
           "NOTE: Passwords are stored hashed and are not included.";

$sent = borjamarky4gmail.com($subject, $message);

// Provide friendly message and redirect to login
if ($sent) {
    echo "✅ Registration successful. An email has been sent to the site owner.<br>";
} else {
    echo "⚠️ Registered, but email could not be sent to the owner (check SMTP/mail settings).<br>";
}
echo "<a href='index.html'>Go to login</a>";