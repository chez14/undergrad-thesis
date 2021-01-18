<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;

class User extends CRUDBase
{
    protected $permissionPrefix = "manage-system-user";
    protected $model = "\\Model\\System\\User";
}
