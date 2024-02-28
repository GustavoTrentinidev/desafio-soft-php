<?php
require_once("../index.php");
require_once("../services/orderItem.php");


class OrdersService extends Connection { 

    public static $orderItems = [];

    public static $orderItemService;

    public function __construct(array $orderItems = []){
        parent::__construct();
        self::$orderItems = $orderItems;
        self::$orderItemService = OrderItemService::getInstance();
    }

    public static function createOrder($orderItems){
        $id = 1;
        $ordersLength = parent::$connection->query("SELECT * FROM orders");
        $ordersLength = $ordersLength->fetchALL();
        

        if($ordersLength){
            $id += count($ordersLength); 
        }

        $order = parent::$connection->prepare("INSERT INTO orders (id, tax, total) values ($id, 0, 0)");
        $order->execute();

        
        foreach($orderItems as $item=>$key){
            $productTaxAndPrice = self::$orderItemService::createOrderItem($key["id"], $id, $key["amount"]);
            if(!empty($productTaxAndPrice["error"])){
                return $productTaxAndPrice["error"];
            }
            self::calcOrderTaxes($productTaxAndPrice);
        }
        self::updateTaxAndTotalOrderValue($id);
        return;
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
        $orders = parent::$connection->query("SELECT * FROM orders");
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