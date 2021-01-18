<?php

namespace Model\Ujian;

class Notification extends \Model\ModelBase
{

    protected
        $fieldConf = array(
            'participants' => [
                'has-many' => ["\\Model\\Ujian\\Participant", "notifications", "ujian_notif_aud"],
                '_copyable' => true
            ],

            'title' => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            'type' => [
                'type' => \DB\SQL\Schema::DT_VARCHAR256,
                'nullable' => true,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            'description' => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            'extras' => [
                'type' => \DB\Cortex::DT_JSON,
                'nullable' => true,
                'index' => false,
                'unique' => false,
                '_copyable' => true
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
        $table = 'ujian_notification';

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

    public function cast($obj = NULL, $rel_depths = 1, $secureCast = true)
    {
        if (!$obj) {
            $obj = $this;
        }

        $casted = parent::cast($obj);

        if ($secureCast) {
            $casted = array_diff_key($casted, array_flip(["participants"]));
        }

        return $casted;
    }
}
