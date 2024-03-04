<?php
    namespace App\Services;
    use App\Public\Index\Connection;
    use App\Exceptions\CustomException;


class CategoryService extends Connection {

    static public $name;
    static public $tax;

    public function __construct(string $name = '', float $tax = 0){
        parent::__construct();
        self::$name = $name;
        self::$tax = $tax;
    }
    
    public static function readCategories($id){ 
            if($id){
                $category = parent::$connection->prepare("SELECT * FROM categories where id = :id");
                $category->bindParam(':id', $id, \PDO::PARAM_INT);
                $category->execute();
                $category = $category->fetch();
                return json_encode($category);
            }
        
        $categories = parent::$connection->query("SELECT * FROM categories where active = 1");
        $categories = $categories->fetchALL();
        return json_encode($categories);
    }

    public static function createCategory(){
        $category = parent::$connection->prepare("INSERT INTO categories (name, tax) VALUES (:name, :tax)");
        $category->bindParam(':name', self::$name, \PDO::PARAM_STR);
        $category->bindParam(':tax', self::$tax, \PDO::PARAM_STR);
        $category->execute();
        return true;
    }

    public static function deleteCategory($id){
        
        if(self::verifyIfCanDelete($id)){
            $delCategory = parent::$connection->prepare("UPDATE categories SET active = 0 WHERE id = :id");
            $delCategory->bindParam(':id', $id, \PDO::PARAM_INT);
            $delCategory->execute();
            return;
        }
        throw new CustomException("Couldn't delete the category because it is a FK in some product" , 401);
    }

    public static function verifyIfCanDelete($id){
        $productsOfCategory = parent::$connection->query
        ("SELECT 
            *
        FROM
            products
        WHERE
            products.category_id = $id
        ");
        $productsOfCategory = $productsOfCategory->fetchALL();
        if(count($productsOfCategory)){
            return false;
        }
        return true;
    }
}