<?php
Namespace Controller\Api;

class Ping extends \Prefab {
    public function get_index($f3){
        return \View\Api::success([]);
    }
}