<?php
// admin.php
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    header('Location: /index.html');
    exit;
}
require_once __DIR__ . '/config.php';

$users = [];
if (file_exists(USERS_FILE)) {
    $users = json_decode(file_get_contents(USERS_FILE), true) ?: [];
}
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Admin Panel</title></head>
<body>
  <h2>Admin Panel</h2>
  <p>Logged in as <?php echo htmlspecialchars($_SESSION['user']['name']); ?> (<a href="logout.php">Logout</a>)</p>

  <h3>Registered users</h3>
  <table border="1" cellpadding="6" cellspacing="0">
    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>DOB</th><th>Username</th><th>Role</th><th>Joined</th></tr></thead>
    <tbody>
    <?php foreach ($users as $u): ?>
      <tr>
        <td><?php echo htmlspecialchars($u['id']); ?></td>
        <td><?php echo htmlspecialchars($u['name']); ?></td>
        <td><?php echo htmlspecialchars($u['email']); ?></td>
        <td><?php echo htmlspecialchars($u['dob']); ?></td>
        <td><?php echo htmlspecialchars($u['username']); ?></td>
        <td><?php echo htmlspecialchars($u['role']); ?></td>
        <td><?php echo htmlspecialchars($u['created_at']); ?></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>

  <h3>Raw backup (userdata.txt)</h3>
  <pre style="background:#f2f2f2;padding:10px;"><?php
    if (file_exists(USERDATA_TXT)) {
      echo htmlspecialchars(file_get_contents(USERDATA_TXT));
    } else {
      echo "No userdata.txt found.";
    }
  ?></pre>
</body>
</html>