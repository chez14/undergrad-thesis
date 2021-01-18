<?php

namespace Controller\Api\System;

use Model\Error;
use Respect\Validation\Exceptions\NestedValidationException;
use \Respect\Validation\Validator as v;

class Auth extends \Controller\Api\Base
{
    /**
     * Login with IP
     *
     * @param \Base $f3
     * @return void
     */
    public function post_iplogin($f3)
    {
        $iplogin = new \Model\System\IPLogin();
        $iplogin->load(["ip = ?", $f3->IP]);
        if ($iplogin->loaded() == 0) {
            throw new Error(
                "IP Login Rerequest Rejected for Obvious Reason",
                "IP $f3->IP is not registered to the system.",
                400,
                "Unmet conditions"
            );
        }

        $token = (string)$iplogin->user->generateToken("ip", $iplogin->_id);
        $locations = $iplogin->locations->castAll();

        return \View\Api::success([
            "id_token" => $token,
            "profile" => $iplogin->user->cast(),
            "locations" => $locations
        ]);
    }

    /**
     * Login with the normal Admin & Username thingy.
     *
     * @param \Base $f3
     * @return void
     */
    public function post_login($f3)
    {
        $validation = v::key("username", v::notOptional())
            ->key("password", v::notOptional());
        try {
            $validation->assert($f3->POST);
        } catch (NestedValidationException $e) {
            throw \Helper\Ruler::transformToError($e);
        }
        $user = new \Model\System\User();

        try {
            if (!($user = $user->login($f3->POST['username'], $f3->POST['password']))) {
                throw new Error("Login failed", "No username/password combo matching.", "400", "Validation Violation");
            }
        } catch (\Exception $e) {
            throw new Error("Login failed", $e->getMessage(), "400", "Validation Violation");
        }

        return \View\Api::success([
            "id_token" => (string) $user->generateToken(),
            "profile" => $user->cast()
        ]);
    }
}
