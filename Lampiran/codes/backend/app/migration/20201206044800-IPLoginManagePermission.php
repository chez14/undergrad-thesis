<?php

namespace Migration;

use Model\System\User;

/**
 * Migration Example
 * Please read more documentation on https://github.com/chez14/f3-ilgar
 */
class IPLoginManagePermission extends \Chez14\Ilgar\MigrationPacket
{
    public function on_migrate()
    {
        $f3 = \F3::instance();
        // create read-only & update-able kinda tingy for this user.
        $permission = [
            "superuser" => [
                "manage-system-iplogin" => \Model\System\AclItem::ALL,
            ],
            "admin" => [
                "manage-system-iplogin" => \Model\System\AclItem::ALL,
            ],
            "iplogin" => [
                "manage-system-iplogin" => \Model\System\AclItem::NONE,
            ],
        ];

        $acls = [];
        foreach ($permission as $name => $r) {
            $acl = new \Model\System\Acl();
            $acl->load(['name = ?', $name]);
            if ($acl->loaded() == 0) {
                $acl->name = $name;
                $acl->save();
            }
            $acls[] = $acl;
            foreach ($r as $codename => $permission) {
                $acli = new \Model\System\AclItem();
                $acli->codename = $codename;
                $acli->permission = $permission;
                $acli->acl = $acl;
                $acli->save();
            }
        }
    }

    public function on_failed(\Exception $e)
    {
    }
}
