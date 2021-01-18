<?php

namespace Controller\Api\Exam;

use View\Api;

class Notification extends \Prefab
{
    public function get_index($f3)
    {
        $participant = \Model\Ujian\Participant::getAnyParticipant();

        if (!$participant) {
            return Api::success([]);
        }

        // Cast the notification without the participant field to minimalize the
        // recursive effect.
        return Api::success($participant->notifications->castAll([
            "participant" => 0
        ]));
    }
}
