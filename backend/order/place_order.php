<?php
header('Content-Type: application/json');
include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['user_id']) || empty($data['total'])) {
    echo json_encode(["error" => "user_id and total required"]);
    exit;
}

$user_id = (int)$data['user_id'];
$total   = (float)$data['total'];

$stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES (?, ?, 'Pending', 'COD')");
$stmt->bind_param("id", $user_id, $total);

if ($stmt->execute()) {
    echo json_encode(["order_id" => $conn->insert_id]);
} else {
    echo json_encode(["error" => "Could not place order"]);
}

$stmt->close();
?>