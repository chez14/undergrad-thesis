<?php

namespace Migration;

/**
 * Migration Example
 * Please read more documentation on https://github.com/chez14/f3-ilgar
 */
class NotificationPermission extends \Chez14\Ilgar\MigrationPacket
{
    public function on_migrate()
    {
        $f3 = \F3::instance();

        // add notification permissions for Admin to manage.
        $permission = [
            "superuser" => [
                "manage-ujian-notification" => \Model\System\AclItem::ALL,
            ],
            "admin" => [
                "manage-ujian-notification" => \Model\System\AclItem::ALL,
            ]
        ];

        foreach ($permission as $name => $r) {
            $acl = new \Model\System\Acl();
            $acl->load(["name = ?", $name]);
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
