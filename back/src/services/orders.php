<?php

require_once('../index.php');
require_once("../services/orderItem.php");
require_once("../services/token.php");
require_once("../exceptions/customException.php");


class OrdersService extends Connection { 

    public static $orderItems = [];
    
    public static $userID;
    
    public static $orderItemService;

    public function __construct(array $orderItems = null){
        parent::__construct();
        self::$orderItemService = OrderItemService::getInstance();
        self::$orderItems = $orderItems;
        $headers = apache_request_headers();
        $token = $headers["Authorization"];
        self::$userID = UserTokenService::getInstance()::verifyToken($token);
    }

    public static function createOrder(){
        $orderItems = self::$orderItems;
        $userID = self::$userID;
        $id = 1;
        $ordersLength = parent::$connection->query("SELECT * FROM orders");
        $ordersLength = $ordersLength->fetchALL();

        if($ordersLength){
            $id += count($ordersLength); 
        }

        $order = parent::$connection->prepare("INSERT INTO orders (id, tax, total, user_id) values ($id, 0, 0, $userID)");
        $order->execute();

        try {
            foreach($orderItems as $item=>$value){
                $productTaxAndPrice = self::$orderItemService::createOrderItem($value["id"], $id, $value["amount"]);
                self::calcOrderTaxes($productTaxAndPrice);
            }
            self::updateTaxAndTotalOrderValue($id);
        } catch (CustomException $e){
            parent::$connection->prepare("DELETE FROM orders WHERE id = $id")->execute();
            throw $e;
        }
    }
    
    public static $tax = 0; 
    public static $total = 0; 

    public static function calcOrderTaxes($productTaxAndPrice){
        ["tax" => $tax, "price" => $price, "amount"=>$amount] = $productTaxAndPrice;
        $tax = (float)$tax;
        $price = (float)$price;
        $tax = ($tax / 100) * $price * $amount;
        self::$tax += $tax;
        self::$total += $tax + $price * $amount;
    }

    public static function updateTaxAndTotalOrderValue($id){
        $tax = self::$tax;
        $total = self::$total;
        $update = parent::$connection->prepare
        ("UPDATE 
            orders
        SET
            tax = $tax, total = $total
        WHERE id = $id
        ");
        $update->execute();
    }

    public static function readOrders(){
        $user_id = self::$userID;
        $orders = parent::$connection->query("SELECT * FROM orders WHERE user_id = $user_id");
        $orders = $orders->fetchALL();
        return json_encode($orders);
    }

    public static function readSpecificOrder($id){
    
        $order_info = parent::$connection->query
        ("SELECT
            o.tax as order_tax,
            o.total as order_total,
            o.id as order_id
        FROM 
            orders o
        WHERE
            o.id = $id    
        ");
        $order_info = $order_info->fetchALL();

        $order_items = parent::$connection->query
        ("SELECT
            oi.name,
            oi.price,
            oi.amount,
            trunc((oi.amount * oi.price + (oi.amount * oi.price * (oi.tax / 100))),2) as total
        FROM
            order_item oi
        WHERE
            oi.order_id = $id
        ");
        $order_items = $order_items->fetchALL();

        $order_array = array("order_info"=> $order_info[0], "products"=> $order_items);

        return json_encode($order_array);
    }
}