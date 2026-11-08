<?php
header('Content-Type: application/json');
include '../config/db.php';

$delivery_id = isset($_POST['delivery_id']) ? (int)$_POST['delivery_id'] : 0;
$order_id    = isset($_POST['order_id'])    ? (int)$_POST['order_id']    : 0;

if (!$delivery_id || !$order_id) {
    echo json_encode(["error" => "delivery_id and order_id required"]);
    exit;
}

$stmt = $conn->prepare("UPDATE orders SET delivery_boy_id = ?, status = 'Out for Delivery' WHERE id = ?");
$stmt->bind_param("ii", $delivery_id, $order_id);

if ($stmt->execute()) {
    echo json_encode(["msg" => "Delivery boy assigned"]);
} else {
    echo json_encode(["error" => "Assignment failed"]);
}

$stmt->close();
?>