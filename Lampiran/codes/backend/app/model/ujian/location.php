<?php

namespace Model\Ujian;

class Location extends \Model\ModelBase
{
    protected
        $fieldConf = array(
            'room_name' => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            'name_alias' => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            'computers' => [
                'has-many' => ["\\Model\\Ujian\\Computer", "location"],
                '_copyable' => false
            ],
            'iplogins' => [
                'has-many' => ["\\Model\\System\\IPLogin", "locations", "system_location_iplogin_link"],
                '_copyable' => false
            ],

            'deleted_on' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => true,
                'index' => false,
                'unique' => false,
                '_copyable' => false
            ],
            'created_on' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => false
            ],
            'updated_on' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => false
            ],
        ),
        $db = 'DB',
        $table = 'ujian_location';

    public function set_deleted_on($date)
    {
        return date("Y-m-d H:i:s", $date);
    }

    public function set_created_on($date)
    {
        return date("Y-m-d H:i:s", $date);
    }

    public function set_updated_on($date)
    {
        return date("Y-m-d H:i:s", $date);
    }

    public function save()
    {
        if (!$this->created_on) {
            $this->created_on = time();
        }
        $this->updated_on = time();
        return parent::save();
    }
}
