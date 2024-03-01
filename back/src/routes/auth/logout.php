<?php
header("Access-Control-Allow-Origin: *");
require_once("../users.php");

Users::getInstance()::logout();