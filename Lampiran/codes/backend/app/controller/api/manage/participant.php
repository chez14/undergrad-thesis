<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;

class Participant extends CRUDBase
{
    protected $permissionPrefix = "manage-ujian-participant";
    protected $model = "\\Model\\Ujian\\Participant";
}
