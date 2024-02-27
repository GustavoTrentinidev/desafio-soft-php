<?php
require_once("../index.php");
require_once("../services/orderItem.php");


class OrdersService extends Connection { 

    public $tax;
    public $total;

    function createOrder(){
        $orderItems = json_decode(file_get_contents('php://input'), true);
        $id = 1;

        $ordersLength = $this->connection->query("SELECT * FROM orders");
        $ordersLength = $ordersLength->fetchALL();
        

        if($ordersLength){
            $id += count($ordersLength); 
        }

        $order = $this->connection->prepare("INSERT INTO orders (id, tax, total) values ($id, 0, 0)");
        $order->execute();

        $orderItemService = new OrderItemService();
        foreach($orderItems as $item=>$key){
            $productTaxAndPrice = $orderItemService->createOrderItem($key["id"], $id, $key["amount"]);
            $this->calcOrderTaxes($productTaxAndPrice);
        }
        $this->updateTaxAndTotalOrderValue($id);
        return;
    }

    function calcOrderTaxes($productTaxAndPrice){
        ["tax" => $tax, "price" => $price, "amount"=>$amount] = $productTaxAndPrice;
        $tax = (float)$tax;
        $price = (float)$price;
        $tax = ($tax / 100) * $price * $amount;
        $this->tax += $tax;
        $this->total += $tax + $price * $amount;
    }

    function updateTaxAndTotalOrderValue($id){
        $update = $this->connection->prepare
        ("UPDATE 
            orders
        SET
            tax = $this->tax, total = $this->total
        WHERE id = $id
        ");
        $update->execute();
    }

    function readOrders(){
        if($_SERVER['QUERY_STRING']){
            return $this->readSpecificOrder();
        }
        
        $orders = $this->connection->query("SELECT * FROM orders");
        $orders = $orders->fetchALL();
        return json_encode($orders);
    }

    function readSpecificOrder(){
        $id = explode('=', $_SERVER['QUERY_STRING'])[1];
        $id = (int)$id;
        
        $order_info = $this->connection->query
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

        $order_items = $this->connection->query
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