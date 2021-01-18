<?php
namespace Helper\Exceptions;

use Respect\Validation\Exceptions\ValidationException;

class MustExistsException extends ValidationException {
    public static $defaultTemplates = [
        self::MODE_DEFAULT => [
            self::STANDARD => '{{name}} must exists',
        ],
        self::MODE_NEGATIVE => [
            self::STANDARD => '{{name}} must not exists',
        ]
    ];
}