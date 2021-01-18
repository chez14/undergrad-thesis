<?php

namespace Migration;

use Model\System\User;

/**
 * Migration Example
 * Please read more documentation on https://github.com/chez14/f3-ilgar
 */
class IPLoginAddition extends \Chez14\Ilgar\MigrationPacket
{
    public function on_migrate()
    {
        $f3 = \F3::instance();
        \Model\System\IPLogin::setup();
        \Model\Ujian\Location::setup();

        // create read-only & update-able kinda tingy for this user.
        $permission = [
            "iplogin" => [
                "manage-ujian-answerslot" => \Model\System\AclItem::ALL,
                "manage-ujian-computer" => \Model\System\AclItem::READ,
                "manage-ujian-exam" => \Model\System\AclItem::READ | \Model\System\AclItem::UPDATE,
                "manage-ujian-lecture" => \Model\System\AclItem::READ,
                "manage-ujian-lectureperiod" => \Model\System\AclItem::READ,
                "manage-ujian-location" => \Model\System\AclItem::READ,
                "manage-ujian-participant" => \Model\System\AclItem::READ,
                "manage-ujian-submission" => \Model\System\AclItem::NONE,
                "manage-system-user" => \Model\System\AclItem::NONE,
                "manage-system-acl" => \Model\System\AclItem::NONE,
                "manage-system-aclitem" => \Model\System\AclItem::NONE,
            ],
        ];

        $acls = [];
        foreach ($permission as $name => $r) {
            $acl = new \Model\System\Acl();
            $acl->name = $name;
            $acl->save();
            $acls[] = $acl;
            foreach ($r as $codename => $permission) {
                $acli = new \Model\System\AclItem();
                $acli->codename = $codename;
                $acli->permission = $permission;
                $acli->acl = $acl;
                $acli->save();
            }
        }

        // create new user
        $user = new User();
        $user->copyfrom([
            "username" => "iplogin",
            "password" => null,
            "email" => "iplogint@labftis.net",
            "acl" => $acls[0]->id
        ]);
        $user->save();
    }

    public function on_failed(\Exception $e)
    {
    }
}
