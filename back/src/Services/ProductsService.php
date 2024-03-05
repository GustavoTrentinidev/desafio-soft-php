<?php
    namespace App\Services;
    use App\Connection;
    use App\Exceptions\CustomException;

class ProductsService extends Connection {

    public static $name;
    public static $price;
    public static $category_id;
    public static $amount;

    public function __construct(string $name = '', float $price = 0, int $category_id = 0, int $amount = 0,) {
        parent::__construct();
        self::$name = $name; 
        self::$price = $price; 
        self::$category_id = $category_id; 
        self::$amount = $amount; 
    }

    public static function readProducts(int $parameterId = 0){
        if($_SERVER['QUERY_STRING'] || $parameterId ){
            $parameterId ? $id = $parameterId : $id = explode("=", $_SERVER['QUERY_STRING'])[1];
            $id = (int)$id;
            if($id){
                $product = parent::$connection->prepare
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
                $product->bindParam(":id", $id, \PDO::PARAM_INT);
                $product->execute();
                $product = $product->fetch();
                return json_encode($product);
            }
        }

        $products = parent::$connection->query
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

    public static function createProduct(){
        $product = parent::$connection->prepare
        ("INSERT INTO 
            products (name, price, category_id, amount)
        VALUES 
            (:name, :price, :category_id, :amount)
        ");
        $product->bindParam(':name', self::$name, \PDO::PARAM_STR);
        $product->bindParam(':price', self::$price, \PDO::PARAM_STR);
        $product->bindParam(':category_id', self::$category_id, \PDO::PARAM_INT);
        $product->bindParam(':amount', self::$amount, \PDO::PARAM_INT);
        $product->execute();
        return true;
    }

    public static function deleteProduct(){
        $id = explode("=", $_SERVER['QUERY_STRING'])[1];
        $id = (int)$id;
        $delProduct =parent::$connection->prepare("UPDATE products SET active = 0 WHERE id = :id");
        $delProduct->bindParam(":id", $id, \PDO::PARAM_INT);
        $delProduct->execute();
        return 1;
    } 

    public static function updateProductStockValue($product, $amount){
        $name = $product["name"];
        if($product["amount"] >= $amount){
            $newAmount = $product["amount"] - $amount;
            $update = parent::$connection->prepare
            ("UPDATE products SET amount = $newAmount WHERE id = {$product['id']}");
            $update->execute();
            return true;
        }
        throw new CustomException("Could not buy $name because it exceeds the stock amount", 401);
    }
}