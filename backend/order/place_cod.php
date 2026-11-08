<?php
header('Content-Type: application/json');
include '../config/db.php';

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;

if (!$user_id) {
    echo json_encode(["error" => "user_id required"]);
    exit;
}

// Calculate total from cart
$stmt = $conn->prepare("SELECT food.price, cart.quantity FROM cart JOIN food ON cart.food_id = food.id WHERE cart.user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$total = 0;
while ($row = $result->fetch_assoc()) {
    $total += $row['price'] * $row['quantity'];
}
$stmt->close();

if ($total == 0) {
    echo json_encode(["error" => "Cart is empty"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES (?, ?, 'Pending', 'COD')");
$stmt->bind_param("id", $user_id, $total);
$stmt->execute();

echo json_encode(["order_id" => $conn->insert_id]);
$stmt->close();
?>