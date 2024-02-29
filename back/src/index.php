<?php
class Connection {
    private $host = "pgsql_desafio";
    private $db = "applicationphp";
    private $user = "root";
    private $pw = "root";

    public static $connection;

    public function __construct(){
        try {
            self::$connection = new PDO("pgsql:host=$this->host;dbname=$this->db", $this->user, $this->pw);
            self::$connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e){
            echo $e;
        }
    }

}

$endPoints = array("endpoints"=>array(
    "http://localhost/routes/categories.php",
    "http://localhost/routes/categories.php?id=1",
    "http://localhost/routes/products.php",
    "http://localhost/routes/products.php?id=1",
    "http://localhost/routes/orders.php",
    "http://localhost/routes/orders.php?id=1"
));

if($_SERVER["REQUEST_URI"] == '/'){
    echo json_encode($endPoints);
}