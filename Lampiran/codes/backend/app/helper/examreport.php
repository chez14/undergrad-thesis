<?php

namespace Helper;

use Model\Ujian\ExamReport as UjianExamReport;

class ExamReport extends \Prefab
{

    public static function generateReportContent(UjianExamReport $examReport): string
    {
        $f3 = \Base::instance();
        // generate link before sending email to leturer.
        $link = [$f3->get("BASE_URL_PUBLIC"), "autonomus", "exam-extract", $examReport->token];
        $link = implode("/", array_map(function ($parts) {
            return trim($parts, "/\\");
        }, $link));

        $f3->mset([
            "link" => $link,
            "exam" => $examReport->exam,
            "examreport" => $examReport
        ], "email.");

        return \Template::instance()->render("emails/exam-finished-lecturer.html");
    }

    public static function sendout(UjianExamReport $examReport)
    {
        $mailer = \Helper\Emailer::getEmailInstance();
        $mailer->isHTML();
        foreach (explode(",", $examReport->tos) as $recipient) {
            $mailer->addAddress($recipient);
        }
        $mailer->Subject = "[Oxam] Berkas ujian " . $examReport->exam->lecture->lecture_code . " - " . $examReport->exam->lecture->name . " tersedia untuk diunduh";
        $mailer->Body = self::generateReportContent($examReport);
        $mailer->send();
    }
}
