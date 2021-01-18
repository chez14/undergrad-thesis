<?php

namespace Controller\Api\Internal;

use \Controller\Api;
use Model\System\User;

class Account extends Api\Base
{

    public function get_me($f3)
    {
        parent::precheck_must_login("You need to log in before you're able to do that.");
        $user = User::getFromSession(false);

        return \View\Api::success(["profile" => $user->cast()]);
    }

    public function post_me($f3)
    {
        parent::precheck_must_login("You need to log in before you're able to do that.");
        $user = User::getFromSession(false);

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

    public function post_login($f3)
    {
        //AppID Check
        if (!$f3->exists("POST.username") || !$f3->exists("POST.password")) {
            throw new \Model\Error("Incomplete Request", "Username and Password must be filled.", "ALP01", "");
        }

        $user = null;
        try {
            $user = User::login($f3->get('POST.username'), $f3->get('POST.password'));
        } catch (\Exception $e) {
            throw new \Model\Error("Bad credential", "You might've entered wrong username/password.", "ALP02", "", 400, null, $e);
        }

        return \View\Api::success(["id_token" => $user->generateToken(), "profile" => $user->cast()]);
    }

    /**
     * Account creations
     */

    public function get_index($f3)
    {
        parent::precheck_must_login("You need to log in before you're able to do that.");

        //add search constraint disini

        $user = new User();
        $users = $user->find(["1"]);

        $users = array_map(function ($data) {
            return $data->cast();
        }, (array) $users);
        return \View\Api::success($users);
    }

    public function post_index($f3)
    {
        parent::precheck_must_login("You need to log in before you're able to do that.");
        if (
            !$f3->exists("POST.username") ||
            !$f3->exists("POST.password_confirm") ||
            !$f3->exists("POST.password") ||
            !$f3->exists("POST.email")
        ) {
            throw new \Model\Error(
                "Uncompleted field",
                "All fields must be filled.",
                "AA03" //TODO: Delegate Error code
            );
        }

        if ($f3->exists('POST.password') && $f3->get('POST.password') != $f3->get('POST.password_confirm')) {
            throw new \Model\Error(
                "Unable to update profile",
                "Your confirmation password is not identical. Please try again.",
                "AA04" //TODO: Delegate Error code
            );
        }

        $user = new User();
        $user->copyFrom(array_intersect($f3->get('POST'), array_flip([
            'email',
            'password',
            'username'
        ])));
        $user->save();

        return \View\Api::success(['profile' => $user->cast()]);
    }

    public function delete_index($f3)
    {
        parent::precheck_must_login("You need to log in before you're able to do that.");

        if (!$f3->exits('GET.id')) {
            throw new \Model\Error("Uncompleted request.", "You need to provide it's id to remove someone.", 403);
        }

        if (in_array($f3->get('GET.id'), [1, 2])) {
            throw new \Model\Error(
                "Cannot delete user.",
                "You can't delete system users. This is required.",
                "AA05" //TODO: Delegate Error code
            );
        }

        $user = User::getFromSession(false);
        if ($f3->get('GET.id') == $user->id) {
            throw new \Model\Error(
                "Cannot delete user.",
                "You can't delete your self.",
                "AA06" //TODO: Delegate Error code
            );
        }

        $user->load(['id=?', $f3->get("GET.id")]);
        if ($user->dry()) {
            throw new \Model\Error(
                "Cannot delete user.",
                "User is nonexistent.",
                "AA07" //TODO: Delegate Error code
            );
        }
        $user->deleted_on = time(); //soft delete them;
        $user->save();
        return \View\Api::success('ok');
    }

    public function put_index($f3)
    {
        parent::precheck_must_login("You need to log in before you're able to do that.");

        if (!$f3->exits('GET.id')) {
            throw new \Model\Error("Uncompleted request.", "You need to provide it's id to update someone.", 403);
        }

        if (in_array($f3->get('GET.id'), [1, 2])) {
            throw new \Model\Error(
                "Cannot update user.",
                "You can't update or modify system users.",
                "AA08" //TODO: Delegate Error code
            );
        }

        $user = new User();
        $user->load(['id=?', $f3->get("GET.id")]);
        if ($user->dry()) {
            throw new \Model\Error(
                "Cannot update user.",
                "User is nonexistent.",
                "AA09" //TODO: Delegate Error code
            );
        }

        $user->copyFrom(array_intersect($f3->get('POST'), array_flip([
            'email',
            'password',
            'username'
        ])));
        $user->save();

        return \View\Api::success(['profile' => $user->cast()]);
    }
}
