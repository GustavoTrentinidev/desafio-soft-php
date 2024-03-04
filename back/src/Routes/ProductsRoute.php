<?php
    namespace App\Routes;
    use App\Services\ProductsService;


class ProductsRoute extends ProductsService {

    private static $instance;

    public static function getInstance(){

        if(!(self::$instance)){
            
            self::$instance = new self();

        }
        return self::$instance;
    }

    public function __construct(){
        if(!empty($_POST)){
            $name = $_POST["name"];
            $price = $_POST["price"];
            $category_id = $_POST["category_id"];
            $amount = $_POST["amount"];
            parent::__construct($name, $price, $category_id, $amount);
            return;
        }
        parent::__construct();

    }
    
    public static function runRequestMethod(){
        
        $method = $_SERVER['REQUEST_METHOD'];
        
        if($method == "GET"){

            echo self::readProducts();

        } else if($method == "POST"){

            echo self::createProduct();

        } else if($method == "DELETE"){

            echo self::deleteProduct();
        }
    }
}