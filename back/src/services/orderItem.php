<?php
require_once("../index.php");
require_once("../services/products.php");


class OrderItemService extends Connection {
    
    function createOrderItem($productID, $orderID, $amount){
        $productService = new ProductsService();
        $product = $productService->readProducts($productID); 
        $product = json_decode($product, true);

        $id = 1;
        $orderItemsLength = $this->connection->query("SELECT * FROM order_item");
        $orderItemsLength = $orderItemsLength->fetchALL();
        $id += count($orderItemsLength);

        $name = $product["name"];
        $price = $product["price"];
        $tax = $product["tax"];

        $orderItem = $this->connection->prepare
        ("INSERT INTO order_item (id, name, price, amount, tax, product_id, order_id)
        VALUES (:id, :name, :price, :amount, :tax, $productID, $orderID)
        ");
        $orderItem->bindParam(":id", $id, PDO::PARAM_INT);
        $orderItem->bindParam(":name", $name, PDO::PARAM_STR);
        $orderItem->bindParam(":price", $price, PDO::PARAM_STR);
        $orderItem->bindParam(":amount", $amount, PDO::PARAM_INT);
        $orderItem->bindParam(":tax", $tax, PDO::PARAM_STR);
        $orderItem->execute();

        $productService->updateProductStockValue($product, $amount);
        return array("tax"=>$tax, "price"=>$price, "amount"=>$amount);
    }
}