<?php
header('Content-Type: application/json');
include '../config/db.php';

$email = trim($_GET['email'] ?? '');

if (empty($email)) {
    echo json_encode([]);
    exit;
}

$stmt = $conn->prepare("
    SELECT orders.*
    FROM orders
    JOIN users ON orders.user_id = users.id
    WHERE users.email = ?
    ORDER BY orders.id DESC
");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode($orders);
$stmt->close();
?>