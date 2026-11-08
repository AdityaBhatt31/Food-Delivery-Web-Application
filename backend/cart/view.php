<?php
include '../config/db.php';

$user_id = $_GET['user_id'];

$res = $conn->query("
SELECT cart.id, food.name, food.price, cart.quantity
FROM cart
JOIN food ON cart.food_id = food.id
WHERE cart.user_id='$user_id'
");

$data = [];
while($row = $res->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>