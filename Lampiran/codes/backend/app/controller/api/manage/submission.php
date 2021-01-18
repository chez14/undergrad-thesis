<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;

class Submission extends CRUDBase
{
    protected $permissionPrefix = "manage-ujian-submission";
    protected $model = "\\Model\\Ujian\\Submission";
}
