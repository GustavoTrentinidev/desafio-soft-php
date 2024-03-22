<?php
    namespace App\Services;
    use App\Connection;
    use App\Exceptions\CustomException;


class CategoryService extends Connection {

    static public $name;
    static public $tax;
    static private $testInstance;

    public function __construct(string $name = '', float $tax = 0){
        parent::__construct();
        self::$name = $name;
        self::$tax = $tax;
    }
    
    public static function getTestInstance(string $name = '', float $tax = 0){

            self::$testInstance = new self($name, $tax);

        return self::$testInstance;
    }

    public static function readCategories($id = 0){ 
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
        if(self::$name && self::$tax){
            $category = parent::$connection->prepare("INSERT INTO categories (name, tax) VALUES (:name, :tax) RETURNING ID, NAME, TAX, ACTIVE");
            $category->bindParam(':name', self::$name, \PDO::PARAM_STR);
            $category->bindParam(':tax', self::$tax, \PDO::PARAM_STR);
            $category->execute();
            $category = $category->fetch();
            return $category;
        }
        throw new CustomException('Creating a category requires to set a name and a tax.', 401);
    }

    public static function deleteCategory($id){
        
        if(self::verifyIfCanDelete($id)){
            $delCategory = parent::$connection->prepare("UPDATE categories SET active = 0 WHERE id = :id RETURNING active");
            $delCategory->bindParam(':id', $id, \PDO::PARAM_INT);
            $delCategory->execute();
            $delCategory = $delCategory->fetch();
            return $delCategory;
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