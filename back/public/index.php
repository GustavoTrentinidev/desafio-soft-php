<?php
    namespace App\Public\Index;
require_once "../vendor/autoload.php";


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");


class Connection {
    private $host = "pgsql_desafio";
    private $db = "applicationphp";
    private $user = "root";
    private $pw = "root";

    public static $connection;

    public function __construct(){
        try {
            self::$connection = new \PDO("pgsql:host=$this->host;dbname=$this->db", $this->user, $this->pw);
            self::$connection->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        } catch (\PDOException $e){
            echo $e;
        }
    }
}


$URI = $_SERVER['REQUEST_URI'];

$endPoints = array("endpoints"=>array(
    "http://localhost/routes/categories.php",
    "http://localhost/routes/categories.php?id=1",
    "http://localhost/routes/products.php",
    "http://localhost/routes/products.php?id=1",
    "http://localhost/routes/orders.php",
    "http://localhost/routes/orders.php?id=1"
));


if($URI == '/'){
    echo json_encode($endPoints);
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