<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
require_once("../services/products.php");


class Products extends ProductsService {
    
    function runRequestMethod(){
        
        $method = $_SERVER['REQUEST_METHOD'];
        
        if($method == "GET"){
            echo $this->readProducts();
        } else if($method == "POST"){
            echo $this->createProduct();
        } else if($method == "DELETE"){
            echo $this->deleteProduct();
        }
    }
}

$productsController = new Products();
$productsController->runRequestMethod();