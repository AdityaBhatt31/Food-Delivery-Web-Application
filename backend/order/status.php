<?php
header('Content-Type: application/json');
include '../config/db.php';

$order_id = isset($_GET['order_id']) ? (int)$_GET['order_id'] : 0;

if (!$order_id) {
    echo json_encode(["error" => "order_id required"]);
    exit;
}

$stmt = $conn->prepare("SELECT status FROM orders WHERE id = ?");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();
$row    = $result->fetch_assoc();

echo json_encode($row ?? ["error" => "Order not found"]);
$stmt->close();
?>