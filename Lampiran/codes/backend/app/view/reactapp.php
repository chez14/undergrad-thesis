<?php
namespace View;

class ReactApp {
    public static function render() {
        echo \Template::instance()->render("index.html");
    }
}