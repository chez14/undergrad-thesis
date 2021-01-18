<?php
Namespace Controller\Api;

abstract class Base extends \Prefab {

    public function beforeroute($f3){
        \Helper\PreAPI::doTheThing();
    }

    protected function precheck_must_login($fail_message = "You need to login before doing anything with Manage API."){
        $user = \Model\System\User::getFromHTTPHeader(true);
        if(!$user){
            throw new \Model\Error(
                "You must login before you're able to do that.",
                $fail_message,
                "XXX01",
                "No token nor session of user detected",
                401
            );
        }
    }
}