<?php
namespace View;

class Bat {
    public static function render($ba_name, $log_file = "batlog.log") {
        \F3::mset([
            "data.logfile"   => $log_file,
        ]);
        return \Template::instance()->render("_bat/" . $ba_name);
    }
}