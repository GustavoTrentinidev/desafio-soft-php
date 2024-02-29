<?php

class CustomException extends Exception {

    protected $message;
    protected $code = 0;
    protected string $file;
    protected int $line;                              

    function __construct($message = "", $code = 0){
 
        if(!$message){

            throw new self('Unknown Exception' );

        }

        $this->message = $message;
        $this->$code = $code;
    }

    function __toString(){

        return get_class($this) . " $this->message in $this->file($this->line)";
    
    }
}