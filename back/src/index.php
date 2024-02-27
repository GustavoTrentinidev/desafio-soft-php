<?php
class Connection {
    private $host = "pgsql_desafio";
    private $db = "applicationphp";
    private $user = "root";
    private $pw = "root";

    public $connection;

    function __construct(){
        try {
            $this->connection = new PDO("pgsql:host=$this->host;dbname=$this->db", $this->user, $this->pw);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e){
            echo $e;
        }
    }

}
