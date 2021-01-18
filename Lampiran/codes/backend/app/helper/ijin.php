<?php
namespace Helper;

use Model\System\User;
use Model\Error;
use Model\System\AclItem;

class Ijin {
    protected static function isUserPresent() {
        if(\Model\System\User::getFromHTTPHeader())
            return true;
            
        if(!\F3::instance()->exists('SYSTEM.USER'))
            return false;
        
        if(!\F3::instance()->get('SYSTEM.USER'))
            return false;
        
        return true;
    }
    public static function userMustPresent() {
        if(!self::isUserPresent()) {
            throw new Error(
                "Bad Auth",
                "You need to login to do that.",
                "403",
                "No Authless Permitted",
                403
            );
        }
    }

    protected static function checkIfUserHave($acl_codename, $level) {
        self::userMustPresent();
        $user = \F3::instance()->get('SYSTEM.USER');
    
        if(!$user->acl)
            return false;
        
        $aclitem = new AclItem();
        $aclitem->load(['acl=? and codename=?', $user->acl->_id, $acl_codename]);

        if(!$aclitem->loaded())
            return false;

        return (($level & intval($aclitem->permission)) == $level);
    }

    public static function mustHave($acl_codename, $level) {
        if(!self::checkIfUserHave($acl_codename, $level)){
            throw new Error(
                "Bad Auth",
                "You don't have permission to do that. Please check if you have that kind of permission on " . $acl_codename . " with level " . $level . " .",
                "403",
                "Bad Permission",
                403
            );
        }
    }
}