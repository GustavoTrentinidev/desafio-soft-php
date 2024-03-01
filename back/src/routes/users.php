<?php
header("Access-Control-Allow-Headers: *");

require_once "../../services/users.php";

class Users extends UsersService {
 
    private static $instance;

    public static function getInstance(){

        if(empty(self::$instance)){

            self::$instance = new self();

        }

        return self::$instance;

    }

    public function __construct(){
        if($_SERVER['SCRIPT_FILENAME'] != "/var/www/html/routes/auth/logout.php"){
            $username = $_POST["username"];
            $password = $_POST["password"];
            parent::__construct($username, $password);
            return;
        }
        parent::__construct();
    }

    public static function register(){
        try {
            echo parent::createUser();
        } catch (CustomException $e){
            echo json_encode(array("error"=>$e->getMessage()));
        }
    }

    public static function login(){
        try {
            echo parent::connectUser();
        } catch (CustomException $e){
            echo json_encode(array("error"=>$e->getMessage()));
        }
    }

    public static function logout(){
        try {
            echo parent::disconnectUser();
        } catch (CustomException $e){
            echo json_encode(array("error"=>$e->getMessage()));
        }
    }

}