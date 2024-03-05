<?php
    namespace App\Public\Index;
    use App\Router\Router;
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
Router::Push($URI);