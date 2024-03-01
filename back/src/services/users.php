<?php

require_once("../../index.php");
require_once("../../exceptions/customException.php");
require_once("../../services/token.php");


Class UsersService extends Connection {

    public static string $username;
    public static string $password;

    public function __construct(string $username = '', string $password = ''){
        parent::__construct();
        self::$username = (string)$username;
        self::$password = (string)$password;
    }

    public static function createUser(){
        try {
            $password = password_hash(self::$password, PASSWORD_DEFAULT);
            $user = parent::$connection->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");
            $user->bindParam(":username", self::$username, PDO::PARAM_STR);
            $user->bindParam(":password", $password, PDO::PARAM_STR);
            $user->execute();   
            $user->fetch();
            return json_encode(array("username"=>self::$username,"password"=>self::$password));
        } catch (PDOException $e){
            throw new CustomException("User already exists.", 401);
        }
    }

    public static function connectUser(){
        $username = self::$username;
        $user = parent::$connection->prepare("SELECT id, password FROM users WHERE username = '$username'");
        $user->execute();
        $user = $user->fetch();
        if(empty($user)){
            throw new CustomException("Couldn't find a matching username", 401);
        }
        if(password_verify(self::$password, $user["password"])){
            $token = UserTokenService::getInstance()::createUserToken($user["id"]);
            echo json_encode(array("accessToken"=>$token));
        } else {
            throw new CustomException("Password don't match.", 401);
        }
    }

    public static function disconnectUser(){
        $headers = apache_request_headers();
        $user_id = UserTokenService::getInstance()::verifyToken($headers["Authorization"]);
        if($user_id){
            $disconnect = parent::$connection->prepare("DELETE FROM user_token WHERE user_id = $user_id");
            $disconnect->execute();
            return json_encode(array("disconnected"=>true));
        }
        throw new CustomException("User not logged");    
    }
}