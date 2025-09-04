<?php
// send_email.php
require_once __DIR__ . '/config.php';

function send_owner_email($subject, $body) {
    if (USE_SMTP) {
        // Try to use PHPMailer if available
        if (file_exists(__DIR__ . '/vendor/autoload.php')) {
            require __DIR__ . '/vendor/autoload.php'; //gumawa ng autoload.php
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            try {
                // Server settings
                $mail->isSMTP();
                $mail->Host = SMTP_HOST;
                $mail->SMTPAuth = true;
                $mail->Username = SMTP_USER;
                $mail->Password = SMTP_PASS;
                $mail->SMTPSecure = SMTP_SECURE;
                $mail->Port = SMTP_PORT;

                // Recipients
                $mail->setFrom(FROM_EMAIL, FROM_NAME);
                $mail->addAddress(OWNER_EMAIL);

                // Content
                $mail->isHTML(false);
                $mail->Subject = $subject;
                $mail->Body    = $body;

                $mail->send();
                return true;
            } catch (Exception $e) {
                // Could log $mail->ErrorInfo
                return false;
            }
        } else {
            // PHPMailer not installed, fallback to mail()
            // Optionally log that PHPMailer is missing.
        }
    }

    // Fallback to PHP mail()
    $headers = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
    return mail(OWNER_EMAIL, $subject, $body, $headers);
}