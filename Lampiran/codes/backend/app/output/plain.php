<?php

namespace Output;

class Plain extends \Prefab
{
    public function serve($data): string
    {
        $f3 = \F3::instance();
        header('Content-type: text/plain');
        $formattedData = "Unsupported API Result type. Please use defined result type, or contact administrator.";
        echo $formattedData;
        return $formattedData;
    }
}
