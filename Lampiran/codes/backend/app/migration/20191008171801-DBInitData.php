<?php
namespace Migration;
/**
 * Migration Example
 * Please read more documentation on https://github.com/chez14/f3-ilgar
 */
class DBInitData extends \Chez14\Ilgar\MigrationPacket {
    public function on_migrate(){
        $f3 = \F3::instance();
        $permission = [
            "superuser" => [
                "manage-ujian-answerslot"=>\Model\System\AclItem::ALL,
                "manage-ujian-computer"=>\Model\System\AclItem::ALL,
                "manage-ujian-exam"=>\Model\System\AclItem::ALL,
                "manage-ujian-lecture"=>\Model\System\AclItem::ALL,
                "manage-ujian-lectureperiod"=>\Model\System\AclItem::ALL,
                "manage-ujian-location"=>\Model\System\AclItem::ALL,
                "manage-ujian-participant"=>\Model\System\AclItem::ALL,
                "manage-ujian-submission"=>\Model\System\AclItem::ALL,
                "manage-system-user"=>\Model\System\AclItem::ALL,
                "manage-system-acl"=>\Model\System\AclItem::ALL,
                "manage-system-aclitem"=>\Model\System\AclItem::ALL,
            ],
            "admin" => [
                "manage-ujian-answerslot"=>\Model\System\AclItem::ALL,
                "manage-ujian-computer"=>\Model\System\AclItem::ALL,
                "manage-ujian-exam"=>\Model\System\AclItem::ALL,
                "manage-ujian-lecture"=>\Model\System\AclItem::ALL,
                "manage-ujian-lectureperiod"=>\Model\System\AclItem::ALL,
                "manage-ujian-location"=>\Model\System\AclItem::ALL,
                "manage-ujian-participant"=>\Model\System\AclItem::ALL,
                "manage-ujian-submission"=>\Model\System\AclItem::READ,
                "manage-system-user"=>\Model\System\AclItem::ALL,
                "manage-system-acl"=>\Model\System\AclItem::READ,
                "manage-system-aclitem"=>\Model\System\AclItem::READ,
            ]
        ];

        $acls = [];
        foreach($permission as $name=>$r) {
            $acl = new \Model\System\Acl();
            $acl->name = $name;
            $acl->save();
            $acls[] = $acl; 
            foreach($r as $codename => $permission) {
                $acli = new \Model\System\AclItem();
                $acli->codename = $codename;
                $acli->permission = $permission;
                $acli->acl = $acl;
                $acli->save();
            }
        }

        $systemuser = new \Model\System\User();
        $systemuser->copyfrom([
            "username" => "system_capybara",
            "password" => "",
            "email" => "bot@labftis.net",
            "acl" => $acls[0]->id
        ]);
        $systemuser->save();

        $admin = new \Model\System\User();
        $admin->copyfrom([
            "username"=>"admin",
            "password"=>"admin",
            "email"=>"chez14@labftis.net",
            "acl" => $acls[0]->id
        ]);
        $admin->save();
    }

    public function on_failed(\Exception $e) {

    }
}