<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;

class AclItem extends CRUDBase
{
    protected $permissionPrefix = "manage-system-aclitem";
    protected $model = "\\Model\\System\\AclItem";
}
