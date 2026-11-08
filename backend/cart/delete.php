<?php
include '../config/db.php';

$id = $_GET['id'];

$conn->query("DELETE FROM cart WHERE id='$id'");

echo json_encode(["msg"=>"Deleted"]);
?>