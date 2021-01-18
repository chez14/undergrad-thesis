<?php
namespace Model\System;

class Acl extends \Model\ModelBase {
    protected
    $fieldConf = array(
        'name'=>[
            'type'=>\DB\SQL\Schema::DT_TEXT,
            'nullable' => false,
            'index' => false,
            'unique' => false,
            '_copyable' => true
        ],
        'items' => [
            'has-many' => ['\Model\System\AclItem', 'acl']
        ],

        'deleted_on'=>[
            'type'=>\DB\SQL\Schema::DT_DATETIME,
            'nullable' => true,
            'index' => false,
            'unique' => false,
        ],
        'created_on'=>[
            'type'=>\DB\SQL\Schema::DT_DATETIME,
            'nullable' => true,
            'index' => false,
            'unique' => false,
        ],
        'updated_on'=>[
            'type'=>\DB\SQL\Schema::DT_DATETIME,
            'nullable' => true,
            'index' => false,
            'unique' => false,
        ],
    ),
    $db = 'DB',
    $table = 'system_acl';

    public function set_deleted_on($date) {
        return date("Y-m-d H:i:s", $date);
    }
    
    public function set_created_on($date) {
        return date("Y-m-d H:i:s", $date);
    }
    
    public function set_updated_on($date) {
        return date("Y-m-d H:i:s", $date);
    }
    
    public function save() {
        if(!$this->created_on)
            $this->created_on = time();
        $this->updated_on = time();
        return parent::save();
    }

    public function cast ($obj = NULL, $rel_depths = 1, $save_cast = true) {
        $obj = parent::cast($obj, $rel_depths);
        if(!$save_cast) {
            return $obj;
        } else {
            unset($obj['items']);
            return $obj;
        }
    }
}