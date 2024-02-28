<?php
require_once("../index.php");
require_once("../services/products.php");


class OrderItemService extends Connection {
    
    public static $productService;

    public function __construct(){
        parent::__construct();
        self::$productService = new ProductsService();
    }

    private static $instance;

    public static function getInstance(){

        if(empty($instance)){

            self::$instance = new self();

        }

        return self::$instance;
    }

    public static function createOrderItem($productID, $orderID, $amount){
        $product = self::$productService::readProducts($productID); 
        $product = json_decode($product, true);

        $name = $product["name"];
        $price = $product["price"];
        $tax = $product["tax"];
        
        $stockRequest = self::$productService::updateProductStockValue($product, $amount);
        
        if($stockRequest == true){
            $orderItem = parent::$connection->prepare
            ("INSERT INTO order_item (name, price, amount, tax, product_id, order_id)
            VALUES (:name, :price, :amount, :tax, $productID, $orderID)
            ");
            $orderItem->bindParam(":name", $name, PDO::PARAM_STR);
            $orderItem->bindParam(":price", $price, PDO::PARAM_STR);
            $orderItem->bindParam(":amount", $amount, PDO::PARAM_INT);
            $orderItem->bindParam(":tax", $tax, PDO::PARAM_STR);
            $orderItem->execute();
    
            return array("tax"=>$tax, "price"=>$price, "amount"=>$amount);
        }
        return array("error"=>"Could not buy $name because it exceeds the stock amount.");
    }
}