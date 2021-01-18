<?php
namespace Migration;
/**
 * Migration Example
 * Please read more documentation on https://github.com/chez14/f3-ilgar
 */
class DBGeneration extends \Chez14\Ilgar\MigrationPacket {
    public function on_migrate(){
        $f3 = \F3::instance();
        
        // making all those models
        \Model\System\User::setup();
        \Model\System\Acl::setup();
        \Model\System\AclItem::setup();
        \Model\Ujian\Computer::setup();
        \Model\Ujian\Location::setup();
        \Model\Ujian\Lecture::setup();
        \Model\Ujian\LecturePeriod::setup();
        \Model\Ujian\Exam::setup();
        \Model\Ujian\AnswerSlot::setup();
        \Model\Ujian\Participant::setup();
        \Model\Ujian\Submission::setup();
    }

    public function on_failed(\Exception $e) {

    }
}