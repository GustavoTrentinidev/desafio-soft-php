<?php
    namespace App\Services;
    use App\Exceptions\CustomException;
    use App\Connection;
    use App\Services\ProductsService;

class OrderItemService extends Connection {
    
    public static $productService;

    public function __construct(){
        parent::__construct();
        self::$productService = new ProductsService();
        // testar sem instanciar o servico do produto
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
        
        // testar sem instanciar o servico do produto
        try {
            self::$productService::updateProductStockValue($product, $amount);
            $orderItem = parent::$connection->prepare
            ("INSERT INTO order_item (name, price, amount, tax, product_id, order_id)
            VALUES (:name, :price, :amount, :tax, $productID, $orderID)
            ");
            $orderItem->bindParam(":name", $name, \PDO::PARAM_STR);
            $orderItem->bindParam(":price", $price, \PDO::PARAM_STR);
            $orderItem->bindParam(":amount", $amount, \PDO::PARAM_INT);
            $orderItem->bindParam(":tax", $tax, \PDO::PARAM_STR);
            $orderItem->execute();
            return array("tax"=>$tax, "price"=>$price, "amount"=>$amount);
        } catch (CustomException $e) {
            throw $e;
        }

    }
}