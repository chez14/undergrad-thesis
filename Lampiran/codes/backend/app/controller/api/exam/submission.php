<?php

namespace Controller\Api\Exam;

use Model\Error;

class Submission extends \Prefab
{
    public function get_submit($f3)
    {
        if (!$f3->exists("GET.answer_slot")) {
            throw new \Model\Error(
                "Incomplete Request",
                "We need the `answer_slot` ID to do that",
                "ES03"
            );
        }

        $participant = \Model\Ujian\Participant::getActiveParticipant();
        if (!$participant) {
            throw new \Model\Error(
                "Unexpected Upload",
                "Answer submission has been closed. Please check your exam time.",
                "ES07"
            );
        }

        $answer_slot = new \Model\Ujian\AnswerSlot();
        $answer_slot->has('exam', ['id=?', $participant->exam->_id]);
        $answer_slot->load(["id = ?", $f3->get("GET.answer_slot")]);

        if ($answer_slot->dry()) {
            throw new \Model\Error(
                "Bad Request",
                "The given `answer_slot` is invalid.",
                "ES04"
            );
        }

        $submission = $answer_slot->getSubmission($participant);
        if ($submission->dry()) {
            throw new Error("No submission found", "Submission not found", "HTTP404", "no reason", 404);
        }
        if ($f3->exists("GET.force_download")) {
            \Web::instance()->send(
                $submission->getFullPath(),
                null,
                0,
                true,
                $submission->answer_slot->simulateFormat($participant)
            );
        } else {
            return \View\Api::success($submission->cast());
        }
    }

    public function post_submit($f3)
    {
        if (!$f3->exists("POST.answer_slot")) {
            throw new \Model\Error(
                "Incomplete Request",
                "We need the `answer_slot` ID to do that",
                "ES03"
            );
        }

        $participant = \Model\Ujian\Participant::getActiveParticipant();
        if (!$participant) {
            throw new \Model\Error(
                "Unexpected Upload",
                "Answer submission has been closed. Please check your exam time.",
                "ES07"
            );
        }


        $answer_slot = new \Model\Ujian\AnswerSlot();
        $answer_slot->has('exam', ['id=?', $participant->exam->_id]);
        $answer_slot->load(["id = ? and deleted_on = ?", $f3->get("POST.answer_slot"), null]);

        if ($answer_slot->dry()) {
            throw new \Model\Error(
                "Bad Request",
                "The given `answer_slot` is invalid.",
                "ES04"
            );
        }

        $web = \Web::instance();
        $files = $web->receive(
            function ($file, $formFieldName) use ($answer_slot, $participant) {
                return (basename($file['name']) == $answer_slot->simulateFormat($participant));
            },
            true,
            false
        );

        if (count($files) > 1) {
            throw new \Model\Error(
                "Bad news",
                "Given answer is not singular. Send one-by-one please.",
                "ES05"
            );
        }

        if (!$files[array_keys($files)[0]]) {
            throw new \Model\Error(
                "Invalid Filename",
                "Given filename is not respecting slot format. Got: " . array_keys($files)[0],
                "ES06"
            );
        }
        $file = array_keys($files)[0];
        $submission = $answer_slot->submit($file, $participant);
        $submission->touch();
        $submission->save();
        return \View\Api::success($submission->cast());
    }
}
