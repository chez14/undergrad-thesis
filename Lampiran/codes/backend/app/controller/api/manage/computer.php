<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;

class Computer extends CRUDBase
{
    protected $permissionPrefix = "manage-ujian-computer";
    protected $model = "\\Model\\Ujian\\Computer";
}
