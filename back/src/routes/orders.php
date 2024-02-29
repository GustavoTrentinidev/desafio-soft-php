<?php
header("Access-Control-Allow-Origin: *");
require_once("../services/orders.php");


class Orders extends OrdersService {

    public static $instance;

    public static function getInstance(){

        if(empty(self::$instance)){

            self::$instance = new self();

        }

        return self::$instance;
    }
    
    public function __construct(){
        if(!empty($_POST)){
            $orderItems = json_decode(file_get_contents('php://input'), true);
            parent::__construct($orderItems);
            return;
        }
        parent::__construct();
    }

    public static function runRequestMethod(){

        $method = $_SERVER['REQUEST_METHOD'];
        
        if($method == "GET"){

            if($_SERVER['QUERY_STRING']){
                $id = explode('=', $_SERVER['QUERY_STRING'])[1];
                $id = (int)$id;

                echo parent::readSpecificOrder($id);

                return;
            }
            echo parent::readOrders();
            
        } else if($method == "POST"){
            $orderItems = json_decode(file_get_contents('php://input'), true);

            try {
                parent::createOrder($orderItems);
                echo json_encode(array("message"=> "ok"));
            } catch (CustomException $e){
                echo json_encode(array("error"=> $e->getMessage()));
            }

        }
    }
}

Orders::getInstance()::runRequestMethod();
