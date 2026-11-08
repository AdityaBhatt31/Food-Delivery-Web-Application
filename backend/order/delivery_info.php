<?php
header('Content-Type: application/json');
include '../config/db.php';

$order_id = isset($_GET['order_id']) ? (int)$_GET['order_id'] : 0;

if (!$order_id) {
    echo json_encode(["error" => "order_id required"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT delivery_boys.name, delivery_boys.phone
    FROM orders
    JOIN delivery_boys ON orders.delivery_boy_id = delivery_boys.id
    WHERE orders.id = ?
");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();
$row    = $result->fetch_assoc();

echo json_encode($row ?? ["msg" => "No delivery boy assigned yet"]);
$stmt->close();
?>