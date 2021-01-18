<?php

namespace Helper;

class PreAPI
{
    public static function doTheThing()
    {
        //auto transform when post/put content type is json.
        if (in_array(strtolower(\F3::instance()->VERB), ["put", "post"])) {
            if (strpos(\F3::instance()->HEADERS['Content-Type'], "application/json") > -1) {
                \F3::instance()->POST = array_merge(\F3::instance()->POST, json_decode(\F3::instance()->BODY, true));
            }
            if (\F3::instance()->HEADERS['Content-Type'] == "application/x-www-form-urlencoded") {
                $res = [];
                parse_str(\F3::instance()->BODY, $res);
                \F3::instance()->POST = array_merge(\F3::instance()->POST, $res);
            }
        }
    }
}
