<?php
    namespace App\Public\Index;
    use App\Router\Router;
    require_once "../vendor/autoload.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");


$URI = $_SERVER['REQUEST_URI'];
Router::Push($URI);