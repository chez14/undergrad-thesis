<?php

namespace View;

class Api
{
    public static function error($data, $http_code = 400, $desc = null): string
    {
        if (!($data instanceof \Model\Error)) {
            $data = new \Model\Error(
                $data,
                $desc,
                "HTTP" . $http_code,
                null,
                $http_code,
                null,
                null
            );
        }
        return self::serve(\Output\Formatter::instance()->format_error($data));
    }

    public static function success($data): string
    {
        return self::serve(\Output\Formatter::instance()->format_success($data));
    }

    protected static function serve($data): string
    {
        $f3 = \F3::instance();
        if (strtolower($f3->PARAMS['extension']) == 'json' || $f3->PARAMS['extension'] == '') {
            return \Output\JSON::instance()->serve($data);
        } else if (strtolower($f3->PARAMS['extension']) == 'xml') {
            return \Output\XML::instance()->serve($data);
        } else {
            return \Output\Plain::instance()->serve($data);
        }
    }
}
