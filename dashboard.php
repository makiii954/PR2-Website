<?php
// dashboard.php
session_start();
if (!isset($_SESSION['user'])) {
    header('Location: /index.html');
    exit;
}
$user = $_SESSION['user'];
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Dashboard</title></head>
<body>
  <h2>Welcome, <?php echo htmlspecialchars($user['name']); ?></h2>
  <p>Username: <?php echo htmlspecialchars($user['username']); ?></p>
  <p>Email: <?php echo htmlspecialchars($user['email']); ?></p>
  <p>Role: <?php echo htmlspecialchars($user['role']); ?></p>
  <p><a href="logout.php">Logout</a></p>
</body>
</html>