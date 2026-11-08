<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "zomato_clone";

$conn = new mysqli($host, $user, $pass, $dbname);


if ($conn->connect_error) {

    header('Content-Type: application/json');
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}
?>