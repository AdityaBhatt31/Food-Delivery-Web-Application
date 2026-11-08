<?php
header('Content-Type: application/json');
include '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "error" => "Invalid request method"]);
    exit;
}

$name          = trim($_POST['name']  ?? '');
$price         = $_POST['price']      ?? '';
$restaurant_id = (int)($_POST['rid']  ?? 0);

if (empty($name) || empty($price) || !$restaurant_id) {
    echo json_encode(["status" => "error", "error" => "All fields required"]);
    exit;
}

$imageName = "";
if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
    $file      = $_FILES['image'];
    $allowed   = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!in_array($file['type'], $allowed)) {
        echo json_encode(["status" => "error", "error" => "Only JPG/PNG allowed"]);
        exit;
    }

    $imageName = time() . "_" . basename($file['name']);
    $target    = "../../uploads/" . $imageName;

    if (!move_uploaded_file($file['tmp_name'], $target)) {
        echo json_encode(["status" => "error", "error" => "Upload failed"]);
        exit;
    }
}

$stmt = $conn->prepare("INSERT INTO food (name, price, restaurant_id, image) VALUES (?, ?, ?, ?)");
$stmt->bind_param("sdis", $name, $price, $restaurant_id, $imageName);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "error" => "DB error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>