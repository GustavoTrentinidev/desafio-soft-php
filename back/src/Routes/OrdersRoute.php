<?php
    namespace App\Routes;
    use App\Services\OrdersService;
    use App\Exceptions\CustomException;


class OrdersRoute extends OrdersService {

    public static $instance;

    public static function getInstance(){

        if(empty(self::$instance)){

            self::$instance = new self();

        }

        return self::$instance;
    }
    
    public function __construct(){
        if(isset($_POST)){
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
            try {
                parent::createOrder();
                echo json_encode(array("message"=> "ok"));
            } catch (CustomException $e){
                echo json_encode(array("error"=> $e->getMessage()));
            }

        }
    }
}

