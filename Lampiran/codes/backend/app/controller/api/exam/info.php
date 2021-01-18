<?php

namespace Controller\Api\Exam;

class Info extends \Prefab
{
    public function get_index($f3)
    {
        header("X-IP: " . $f3->get("IP"));
        $participant = \Model\Ujian\Participant::getAnyParticipant();
        if ($participant) {
            $parObj = $participant->cast(null, 2);
            $parObj['exam']['answer_slot'] = array_map(function ($answer_slot) use ($participant) {
                if ($answer_slot->deleted_on) {
                    return null;
                }
                return $answer_slot->cast(null, 0, true, $participant);
            }, (array) $participant->exam->answer_slot);

            // prevent other participant info leaking.
            $parObj['exam']['participants'] = [];
            return \View\Api::success($parObj);
        }
        return \View\Api::success([]);
    }
}
