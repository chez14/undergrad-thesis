<?php
namespace Helper;

use Respect\Validation\Exceptions\NestedValidationException;
use Model\Error;

class Ruler {
    public static function transformToError(NestedValidationException $e) {
        $messages = $e->getMessages();

        $messages = implode(", ", $messages);
        return new Error(
            "Bad Request", 
            $messages, 
            "400",
            "Param not valid", 400
        );
    }
}