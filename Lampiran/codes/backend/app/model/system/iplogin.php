<?php

namespace Model\System;

class IPLogin extends \Model\ModelBase
{
    protected
        $fieldConf = array(
            'ip' => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => true,
                '_copyable' => true
            ],
            'user' => [
                'belongs-to-one' => '\Model\System\User',
                'nullable' => false,
                '_copyable' => true
            ],
            'locations' => [
                'has-many' => ["\\Model\\Ujian\\Location", "iplogins", "system_location_iplogin_link"],
                '_copyable' => true
            ],
            'notes' => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],

            'created_on' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => true,
                'index' => false,
                'unique' => false,
            ],
            'updated_on' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => true,
                'index' => false,
                'unique' => false,
            ],
        ),
        $db = 'DB',
        $table = 'system_iplogin';

    public function save()
    {
        if (!$this->created_on)
            $this->created_on = time();
        $this->updated_on = time();
        return parent::save();
    }

    public function set_created_on($date) {
        return date("Y-m-d H:i:s", $date);
    }
    
    public function set_updated_on($date) {
        return date("Y-m-d H:i:s", $date);
    }
}
