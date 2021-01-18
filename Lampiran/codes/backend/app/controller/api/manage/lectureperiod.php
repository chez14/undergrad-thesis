<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;

class LecturePeriod extends CRUDBase
{
    protected $permissionPrefix = "manage-ujian-lectureperiod";
    protected $model = "\\Model\\Ujian\\LecturePeriod";
}
