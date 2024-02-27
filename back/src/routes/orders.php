<?php
header("Access-Control-Allow-Origin: *");
require_once("../services/orders.php");


class Orders extends OrdersService {
    
    function runRequestMethod(){
        
        $method = $_SERVER['REQUEST_METHOD'];
        
        if($method == "GET"){
            echo $this->readOrders();
        } else if($method == "POST"){
            echo $this->createOrder();
        }
    }
}

$orderController = new Orders();
$orderController->runRequestMethod();