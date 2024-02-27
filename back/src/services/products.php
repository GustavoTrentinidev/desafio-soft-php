<?php
require_once("../index.php");

class ProductsService extends Connection {

    function readProducts(int $parameterId = 0){
        if($_SERVER['QUERY_STRING'] || $parameterId ){
            $parameterId ? $id = $parameterId : $id = explode("=", $_SERVER['QUERY_STRING'])[1];
            $id = (int)$id;
            if($id){
                $product = $this->connection->prepare
                ("SELECT 
                    p.id,
                    p.name,
                    p.price,
                    p.amount,
                    p.active,
                    c.tax
                from 
                    products p
                JOIN
                    categories c
                ON
                    p.category_id = c.id
                WHERE
                    p.id = :id 
                ");
                $product->bindParam(":id", $id, PDO::PARAM_INT);
                $product->execute();
                $product = $product->fetch();
                return json_encode($product);
            }
        }

        $products = $this->connection->query
        ("SELECT
            p.id,
            p.name,
            p.amount,
            c.name as category_name,
            p.price,
            p.active
        FROM
            products p
        JOIN
            categories c
        ON 
            c.id = p.category_id
        where 
            p.active = 1");
        $products = $products->fetchALL();
        return json_encode($products);

    }

    function createProduct(){
        $id = 1;
        $name = $_POST["name"];
        $price = $_POST["price"];
        $category_id = $_POST["category_id"];
        $amount = $_POST["amount"];

        $productsLength = $this->connection->query("SELECT * FROM products");
        $productsLength = $productsLength->fetchALL();
        
        if($productsLength){
            $id += count($productsLength);
        }

        $product = $this->connection->prepare
        ("INSERT INTO 
            products (id, name, price, category_id, amount)
        VALUES 
            (:id, :name, :price, :category_id, :amount)
        ");
        $product->bindParam(':id', $id, PDO::PARAM_INT);
        $product->bindParam(':name', $name, PDO::PARAM_STR);
        $product->bindParam(':price', $price, PDO::PARAM_STR);
        $product->bindParam(':category_id', $category_id, PDO::PARAM_INT);
        $product->bindParam(':amount', $amount, PDO::PARAM_INT);
        $product->execute();
        return true;
    }

    function deleteProduct(){
        $id = explode("=", $_SERVER['QUERY_STRING'])[1];
        $id = (int)$id;
        $delProduct = $this->connection->prepare("UPDATE products SET active = 0 WHERE id = :id");
        $delProduct->bindParam(":id", $id, PDO::PARAM_INT);
        $delProduct->execute();
        return 1;
    } 

    function updateProductStockValue($product, $amount){
        $newAmount = $product["amount"] - $amount;
        $update = $this->connection->prepare
        ("UPDATE products SET amount = $newAmount WHERE id = {$product['id']}");
        $update->execute();
    }
}