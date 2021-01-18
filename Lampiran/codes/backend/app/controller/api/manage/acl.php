<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;

class Acl extends CRUDBase
{
    protected $permissionPrefix = "manage-system-acl";
    protected $model = "\\Model\\System\\Acl";
}
