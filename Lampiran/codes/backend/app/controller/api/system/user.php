<?php

namespace Controller\Api\System;

use Controller\Api\Base;

class User extends Base
{
    public function get_me($f3)
    {
        parent::precheck_must_login("You need to log in before you're able to do that.");
        $user = \Model\System\User::getFromHTTPHeader();

        $response = ["profile" => $user->cast()];

        $iplogin = \Model\System\User::getIPLoginHTTPHeader();
        if ($iplogin !== null) {
            $response['locations'] = $iplogin->locations->castAll();
        }

        return \View\Api::success($response);
    }

    public function post_me($f3)
    {
        parent::precheck_must_login("You need to log in before you're able to do that.");
        $user = \Model\System\User::getFromHTTPHeader();

        if ($f3->exists('POST.password') && (!$f3->exists('POST.old_password') || !$f3->exists('POST.password_confirm'))) {
            throw new \Model\Error(
                "Unable to update profile",
                "Requested password change, but doens't provide old password for confirmation or, you might not enter the password confirmation correctly.",
                "AA01" //TODO: Delegate Error code
            );
        }

        if ($f3->exists('POST.password') && $f3->get('POST.password') != $f3->get('POST.password_confirm')) {
            throw new \Model\Error(
                "Unable to update profile",
                "Your confirmation password is not identical. Please try again.",
                "AA02" //TODO: Delegate Error code
            );
        }

        //password is ok. all save to go.
        $user->copyfrom(array_intersect_key($f3->get("POST"), array_flip([
            'username',
            'password',
            'email'
        ])));
        $user->save();

        return \View\Api::success(["profile" => $user->cast()]);
    }
}
