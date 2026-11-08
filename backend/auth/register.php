<?php
include '../config/db.php';
$data=json_decode(file_get_contents("php://input"),true);

$pass=password_hash($data['password'],PASSWORD_DEFAULT);

$conn->query("INSERT INTO users(name,email,password)
VALUES('{$data['name']}','{$data['email']}','$pass')");

echo json_encode(["msg"=>"Registered"]);
?>