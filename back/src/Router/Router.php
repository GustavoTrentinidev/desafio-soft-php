<?php
    namespace App\Router;


class Router {

    public static $endPoints = array("endpoints"=>array(
        "http://localhost/routes/categories.php",
        "http://localhost/routes/categories.php?id=1",
        "http://localhost/routes/products.php",
        "http://localhost/routes/products.php?id=1",
        "http://localhost/routes/orders.php",
        "http://localhost/routes/orders.php?id=1"
    ));

    public static function Push(string $URI){
        if($URI == '/'){
            echo json_encode(self::$endPoints);
        } else if(str_contains($URI, '/routes/products.php')){
            \App\Routes\ProductsRoute::getInstance()::runRequestMethod();
        } else if(str_contains($URI, '/routes/orders.php')){
            \App\Routes\OrdersRoute::getInstance()::runRequestMethod();
        } else if(str_contains($URI, '/routes/categories.php')){
            \App\Routes\CategoryRoute::getInstance()::runRequestMethod();
        } else if(str_contains($URI, "/routes/auth/login.php")){
            \App\Routes\UserRoute::getInstance()::login();
        } else if(str_contains($URI, "/routes/auth/register.php")){
            \App\Routes\UserRoute::getInstance()::register();
        } else if(str_contains($URI, "/routes/auth/logout.php")){
            \App\Routes\UserRoute::getInstance()::logout();
        } else{
            echo 404;
        }
    }

}