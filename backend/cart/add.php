<?php
include '../config/db.php';

$data=json_decode(file_get_contents("php://input"),true);

$conn->query("INSERT INTO cart(user_id,food_id,quantity)
VALUES('{$data['user_id']}','{$data['food_id']}','{$data['quantity']}')");

echo json_encode(["msg"=>"Added"]);
?>