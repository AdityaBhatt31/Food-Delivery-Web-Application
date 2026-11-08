<?php
include '../config/db.php';

$res=$conn->query("SELECT food.id, food.name, food.price, food.image, restaurants.name AS restaurant
FROM food
JOIN restaurants ON food.restaurant_id = restaurants.id");

$data=[];
while($row=$res->fetch_assoc()){
    $data[]=$row;
}

echo json_encode($data);


?>