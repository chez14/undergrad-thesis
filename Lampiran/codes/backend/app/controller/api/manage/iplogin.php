<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;

class IPLogin extends CRUDBase
{
    protected $permissionPrefix = "manage-system-iplogin";
    protected $model = "\\Model\\System\\IPLogin";
}
