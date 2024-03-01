<?php

if(explode("/", $_SERVER['SCRIPT_NAME'])[2] == 'auth'){
    require_once('../../index.php');
    require_once("../../exceptions/customException.php");
} else{
    require_once('../index.php');
    require_once("../exceptions/customException.php");
}


class UserTokenService extends Connection {

    private static $instance;

    public static function getInstance(){

        if(empty(self::$instance)){

            self::$instance = new self();

        }

        return self::$instance;
    }

    public static function getUserToken(int $user_id){
        $token = parent::$connection->query("SELECT token FROM user_token where user_id = $user_id");
        $token = $token->fetch();
        return $token;
    }

    public static function createUserToken(int $user_id){
        if(self::getUserToken($user_id)){
            throw new CustomException("User already logged in", 401);
        }
        $token = parent::$connection->prepare
        ("INSERT INTO
            user_token (user_id, token)
        VALUES
            ($user_id, MD5(random()::text))
        ");
        $token->execute();
        return self::getUserToken($user_id);
    }

    public static function verifyToken($token){
        $verify = parent::$connection->query
        ("SELECT 
            user_id
        FROM
            user_token
        WHERE 
            token = '$token'
        ");
        $verify = $verify->fetch();
        return $verify["user_id"];
    } 

}