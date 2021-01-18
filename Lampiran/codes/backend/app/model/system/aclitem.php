<?php
namespace Model\System;

class AclItem extends \Model\ModelBase {
    protected
    $fieldConf = array(
        'codename'=>[
            'type'=>\DB\SQL\Schema::DT_TEXT,
            'nullable' => false,
            'index' => false,
            'unique' => false,
            '_copyable' => true
        ],
        'permission'=>[
            'type'=>\DB\SQL\Schema::DT_INT,
            'nullable' => false,
            'index' => false,
            'unique' => false,
            '_copyable' => true
        ],
        'acl' => [
            'belongs-to-one' => '\Model\System\Acl',
            '_copyable' => true
        ],
    ),
    $db = 'DB',
    $table = 'system_acl_item';

    const
        NONE = 0,
        CREATE = 1,
        READ = 1 << 1,
        UPDATE = 1 << 2,
        DELETE = 1 << 3,
        ALL = self::CREATE | self::READ | self::UPDATE | self::DELETE;
}