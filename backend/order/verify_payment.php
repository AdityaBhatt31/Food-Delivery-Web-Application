<?php
header('Content-Type: application/json');
include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['order_id']) || empty($data['payment_id'])) {
    echo json_encode(["error" => "order_id and payment_id required"]);
    exit;
}

$order_id   = (int)$data['order_id'];
$payment_id = $conn->real_escape_string($data['payment_id']);

$stmt = $conn->prepare("UPDATE orders SET payment_status = 'Paid', status = 'Confirmed', payment_id = ? WHERE id = ?");
$stmt->bind_param("si", $data['payment_id'], $order_id);

if ($stmt->execute()) {
    echo json_encode(["msg" => "Payment verified successfully"]);
} else {
    echo json_encode(["error" => "Update failed"]);
}

$stmt->close();
?>