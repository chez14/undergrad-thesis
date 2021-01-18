<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;
use Helper\ExamReport as HelperExamReport;
use Model\System\AclItem;
use View\Api;

class ExamReport extends CRUDBase
{
    protected $permissionPrefix = "manage-ujian-exam-report";
    protected $model = "\\Model\\Ujian\\ExamReport";

    public function post_item_forcesend($f3)
    {
        $this->permission_check($this->permissionPrefix, AclItem::UPDATE);
        $examreport = parent::getMentionedItem($f3);

        $log = $examreport->exam->getLoggerInstance();
        $log->notice("[MANUAL] Autoreport is sent to " . $examreport->tos . " with id ExamReport#" . $examreport->_id);

        // push validity periode of the token
        // just to make sure things gone right
        $examreport->pushValidity();
        $examreport->sent_on = time();
        $examreport->save();

        HelperExamReport::sendout($examreport);

        return Api::success([]);
    }
}
