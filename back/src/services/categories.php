<?php
require_once("../index.php");

class CategoriesService extends Connection {
    
    function readCategories(){ 

        if($_SERVER['QUERY_STRING']){
            
            $id = explode('=', $_SERVER['QUERY_STRING'])[1];
            $id = (int)$id;

            if($id){
                $category = $this->connection->prepare("SELECT * FROM categories where id = :id");
                $category->bindParam(':id', $id, PDO::PARAM_INT);
                $category->execute();
                $category = $category->fetch();
                return json_encode($category);
            }
        }
        $categories = $this->connection->query("SELECT * FROM categories where active = 1");
        $categories = $categories->fetchALL();
        return json_encode($categories);
    }

    function createCategory(){
        $id = 1;
        $name = (string)$_POST["name"];
        $tax = (float)$_POST["tax"];

        $categoriesLength = $this->connection->query("SELECT * from categories");
        $categoriesLength = $categoriesLength->fetchALL();

        if($categoriesLength){
            $id += count($categoriesLength); 
        }

        $category = $this->connection->prepare("INSERT INTO categories VALUES (:id, :name, :tax)");
        $category->bindParam(':id', $id, PDO::PARAM_INT);
        $category->bindParam(':name', $name, PDO::PARAM_STR);
        $category->bindParam(':tax', $tax, PDO::PARAM_STR);
        $category->execute();
        return true;
    }

    function deleteCategory(){
        $id = explode('=', $_SERVER['QUERY_STRING'])[1];
        if($this->verifyIfCanDelete($id)){
            $delCategory = $this->connection->prepare("UPDATE categories SET active = 0 WHERE id = :id");
            $delCategory->bindParam(':id', $id, PDO::PARAM_INT);
            $delCategory->execute();
            return json_encode(array("status"=>"ok"));
        }
        return (json_encode(array("status"=>"error")));
    }

    function verifyIfCanDelete($id){
        $productsOfCategory = $this->connection->query
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