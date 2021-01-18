<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;

class AnswerSlot extends CRUDBase
{
    protected $permissionPrefix = "manage-ujian-answerslot";
    protected $model = "\\Model\\Ujian\\AnswerSlot";
}
