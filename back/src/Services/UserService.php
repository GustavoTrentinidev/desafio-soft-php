<?php
    namespace App\Services;
    use App\Public\Index\Connection;
    use App\Exceptions\CustomException;
    use App\Services\TokenService;

Class UserService extends Connection {

    public static string $username;
    public static string $password;

    public function __construct(string $username = '', string $password = ''){
        parent::__construct();
        self::$username = (string)$username;
        self::$password = (string)$password;
    }

    public static function createUser(){
        try {
            self::verifyCredentials();
            try {
                $password = password_hash(self::$password, PASSWORD_DEFAULT);
                $user = parent::$connection->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");
                $user->bindParam(":username", self::$username, \PDO::PARAM_STR);
                $user->bindParam(":password", $password, \PDO::PARAM_STR);
                $user->execute();   
                $user->fetch();
                return json_encode(array("username"=>self::$username,"password"=>self::$password));
            } catch (\PDOException $e){
                throw new CustomException("User already exists.", 401);
            }
        } catch(CustomException $error){
            throw new CustomException($error->getMessage(), 401);
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
            $token = TokenService::getInstance()::createUserToken($user["id"]);
            echo json_encode(array("accessToken"=>$token));
        } else {
            throw new CustomException("Password don't match.", 401);
        }
    }

    public static function disconnectUser(){
        $headers = apache_request_headers();
        $user_id = TokenService::getInstance()::verifyToken($headers["Authorization"]);
        if($user_id){
            $disconnect = parent::$connection->prepare("DELETE FROM user_token WHERE user_id = $user_id");
            $disconnect->execute();
            return json_encode(array("disconnected"=>true));
        }
        throw new CustomException("User not logged");    
    }

    public static function verifyCredentials(){
        if(self::$username == '' || self::$username == ''){
            throw new CustomException("Username or password can't be null", 401);
        }
        if (strlen(self::$username) < 4){
            throw new CustomException("Username have to be longer then 4 characters.", 401);
        }if (strlen(self::$password) < 4 || strlen(self::$password) > 16){
            throw new CustomException("Password have to be longer then 4 characters and lower than 16 characters.", 401);
        }
        if (preg_match("/\s/", self::$password)) {
            throw new CustomException("Password should not contain any white space.", 401);
        }
        // if (!preg_match("/\d/", self::$password)) {
        //     throw new CustomException("Password should contain at least one digit.", 401) ;
        // }
        // if (!preg_match("/[A-Z]/", self::$password)) {
        //     throw new CustomException("Password should contain at least one uppercase character.", 401) ;
        // }
        // if (!preg_match("/[a-z]/", self::$password)) {
        //     throw new CustomException("Password should contain at least one lowercase character.", 401) ;
        // }
        // if (!preg_match("/\W/", self::$password)) {
        //     throw new CustomException("Password should contain at least one special character.", 401);
        // }
    }
}