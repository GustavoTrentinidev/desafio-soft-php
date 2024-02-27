<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
require_once("../services/categories.php");


Class Categories extends CategoriesService {

    
    function runRequestMethod(){
        
        $method = $_SERVER['REQUEST_METHOD'];
        
        if($method == "GET"){
            echo $this->readCategories();
        } else if($method == "POST"){
            echo $this->createCategory();
        } else if($method == "DELETE"){
            echo $this->deleteCategory();
        }
    }

}

$categoriesController = new Categories();
$categoriesController->runRequestMethod();