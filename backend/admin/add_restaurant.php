<?php
header('Content-Type: application/json');
include '../config/db.php';

$name     = trim($_POST['name']     ?? '');
$location = trim($_POST['location'] ?? '');

if (empty($name)) {
    echo json_encode(["status" => "error", "error" => "Name is required"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO restaurants (name, location) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $location);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "error" => $conn->error]);
}

$stmt->close();
?>