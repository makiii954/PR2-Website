<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $dob = $_POST['dob'];
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Save to a text file
    $file = fopen("userdata.txt", "a");
    fwrite($file, "$username|$password|$name|$email|$dob\n");
    fclose($file);

    // Send email to owner
    $to = "borjamarky4@gmail.com"; // change to your real email
    $subject = "New User Registration";
    $message = "A new user registered:\n\n".
               "Name: $name\n".
               "Email: $email\n".
               "DOB: $dob\n".
               "Username: $username\n".
               "Password: $password\n";
    $headers = "From: no-reply@yourwebsite.com";

    mail($to, $subject, $message, $headers);

    echo "✅ Registration successful! <a href='login.html'>Login here</a>";
}
?>