<?php
header('Content-Type: application/json');
include '../config/db.php';

$email  = trim($_POST['email']  ?? '');
$status = trim($_POST['status'] ?? '');

if (empty($email) || empty($status)) {
    echo json_encode(["status" => "error", "error" => "Email and status are required"]);
    exit;
}

$stmt = $conn->prepare("
    UPDATE orders
    SET status = ?
    WHERE user_id = (SELECT id FROM users WHERE email = ? LIMIT 1)
");
$stmt->bind_param("ss", $status, $email);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "error" => "No orders found or status already set"]);
    }
} else {
    echo json_encode(["status" => "error", "error" => "DB Error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>