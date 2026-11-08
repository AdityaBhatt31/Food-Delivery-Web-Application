<?php
header('Content-Type: application/json');
include '../config/db.php';

$res  = $conn->query("SELECT * FROM restaurants");
$data = [];

while ($r = $res->fetch_assoc()) {
    $rid   = (int)$r['id'];
    $foods = [];

    $stmt = $conn->prepare("SELECT * FROM food WHERE restaurant_id = ?");
    $stmt->bind_param("i", $rid);
    $stmt->execute();
    $fres = $stmt->get_result();

    while ($f = $fres->fetch_assoc()) {
        $foods[] = $f;
    }
    $stmt->close();

    $r['food'] = $foods;
    $data[]    = $r;
}

echo json_encode($data);
?>