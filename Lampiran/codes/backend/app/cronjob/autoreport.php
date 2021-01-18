<?php

namespace CronJob;

use Helper\ExamReport as HelperExamReport;
use Model\Ujian\ExamReport;

class AutoReport extends \Prefab
{
    public function exam($f3)
    {
        // fetch all exam with sent report is null.
        $examreport = new ExamReport();
        $examreport->has("exam", ["time_ended < ?", date("Y-m-d H:i:s", strtotime("-15 minutes"))]); // TODO: Move fine tuner to other places
        $exams = $examreport->find(["sent_on = ?", null]);
        if ($exams === false) {
            $exams = [];
        }
        foreach ($exams as $examr) {
            $log = $examr->exam->getLoggerInstance();
            $log->notice("[CRONJOB] Autoreport is sent to " . $examr->tos . " with id ExamReport#" . $examr->_id);

            $examr->sent_on = time();
            $examr->pushValidity();

            HelperExamReport::sendout($examr);
        }
    }
}
