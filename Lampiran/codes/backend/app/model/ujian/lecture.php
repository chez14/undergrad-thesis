<?php
namespace Model\Ujian;

class Lecture extends \Model\ModelBase {
    protected
        $fieldConf = array(
            'name'=>[
                'type'=>\DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            'lecture_code'=>[
                'type'=>\DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
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
    $table = 'ujian_lecture';
    
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
}