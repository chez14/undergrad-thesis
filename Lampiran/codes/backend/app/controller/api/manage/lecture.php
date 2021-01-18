<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;

class Lecture extends CRUDBase
{
    protected $permissionPrefix = "manage-ujian-lecture";
    protected $model = "\\Model\\Ujian\\Lecture";
}
