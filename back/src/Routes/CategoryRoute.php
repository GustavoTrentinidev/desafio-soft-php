<?php
    namespace App\Routes;
    use App\Services\CategoryService;
    use App\Exceptions\CustomException;


Class CategoryRoute extends CategoryService {
    
    private static $instance;
    
    public static function getInstance(){
        if (!self::$instance){

            self::$instance = new self();
        
        }
        return self::$instance;
    }


    public static $name;
    public static $tax;
    

    public function __construct(){
        if(!empty($_POST)){
            self::$name = (string)$_POST["name"];
            self::$tax = (float)$_POST["tax"];
            parent::__construct(self::$name, self::$tax);
            return;
        }
        parent::__construct();
    }

    public static function runRequestMethod(){
        
        $method = $_SERVER['REQUEST_METHOD'];
        
        if($method == "GET"){

            $id = null;

            if($_SERVER['QUERY_STRING']){
                $id = explode('=', $_SERVER['QUERY_STRING'])[1];
                $id = (int)$id;
            }

            echo parent::readCategories($id);
        }
         else if($method == "POST"){

            echo parent::createCategory();

        }
         else if($method == "DELETE"){
            
            $id = explode('=', $_SERVER['QUERY_STRING'])[1];
            try {
                parent::deleteCategory($id);
                echo json_encode(array("message"=> "ok"));
            } catch (CustomException $e){
                $message = $e->getMessage();
                echo json_encode(array("error"=> $message));
            }
        }
    }

}

// $categoriesController = new Categories();
// $categoriesController::runRequestMethod();