<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;

class Location extends CRUDBase
{
    protected $permissionPrefix = "manage-ujian-location";
    protected $model = "\\Model\\Ujian\\Location";
}
