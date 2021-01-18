<?php

namespace Helper;

use Model\Ujian\Exam;
use Model\Ujian\Submission;

class AnswerZipper extends \Prefab
{
    public static function zipExam(Exam $exam): string
    {
        $submission = new Submission();
        $submission->has("answer_slot", ["deleted_on = ?", null]);
        $submission->has("participant.exam", ["id=?", $exam->_id]);
        $submissions = $submission->find();

        if (!is_array($submissions)) {
            $submissions = [];
        }

        // starting to packing things.
        $zip = new \ZipArchive();
        $zipname = \F3::get('TEMP') . DIRECTORY_SEPARATOR . $exam->exam_uniqcode . ".zip";
        $zip->open($zipname, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        $zip->addFromString("_examInfo.json", json_encode($exam->cast()));

        foreach ($submissions as $sub) {
            $foldername = $sub->participant->username;
            $foldername .= DIRECTORY_SEPARATOR . $sub->answer_slot->simulateFormat($sub->participant);

            $zip->addFromString($foldername, file_get_contents($sub->getFullPath()));
        }
        $zip->close();

        return $zipname;
    }


    public static function getProperFilename(Exam $exam, bool $withDate = true): string
    {
        $filename = $exam->lecture->lecture_code . " " . $exam->lecture->name;
        if ($exam->shift) {
            $filename .= " Shift " . $exam->shift;
        }

        if ($withDate) {
            $filename .= " -- " . date("Y-m-d");
        }

        return $filename;
    }
}
