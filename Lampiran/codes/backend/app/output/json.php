<?php

namespace Output;

class JSON extends \Prefab
{
    public function serve($data): string
    {
        $f3 = \F3::instance();
        header('Content-type: application/json');
        $formattedData = json_encode(
            $data,
            ($f3->exists("GET.json_pretty_print") ? JSON_PRETTY_PRINT : 0)
        );

        echo $formattedData;
        return $formattedData;
    }
}
