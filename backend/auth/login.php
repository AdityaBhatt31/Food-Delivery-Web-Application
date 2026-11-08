<?php
include '../config/db.php';

$data=json_decode(file_get_contents("php://input"),true);

$res=$conn->query("SELECT * FROM users WHERE email='{$data['email']}'");
$user=$res->fetch_assoc();

if($user && password_verify($data['password'],$user['password'])){
    echo json_encode(["user_id"=>$user['id']]);
}else{
    echo json_encode(["error"=>"Invalid"]);
}
?>