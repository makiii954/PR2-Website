<?php
// config.php
// Edit these values before use.

define('OWNER_EMAIL', 'borjamarky4@gmail.com'); // <-- change to website owner email

// Storage files (must be writable by web server)
define('USERS_FILE', __DIR__ . '/users.json');    // stores accounts (JSON array)
define('USERDATA_TXT', __DIR__ . '/userdata.txt'); // simple backup file

// SMTP settings: if USE_SMTP = true, PHPMailer + SMTP is used.
// If USE_SMTP = false, PHP mail() will be used (may be blocked on some hosts).
define('USE_SMTP', false);

define('SMTP_HOST', 'smtp.example.com');
define('SMTP_PORT', 587); // 587 or 465
define('SMTP_SECURE', 'tls'); // 'tls' or 'ssl'
define('SMTP_USER', 'smtp_user@example.com');
define('SMTP_PASS', 'smtp_password');

// From header for outgoing email
define('FROM_EMAIL', 'no-reply@yourwebsite.com');
define('FROM_NAME', 'Website Registration');