<?php

use Model\Ujian\Computer;
use Model\Ujian\Exam;
use Model\Ujian\Lecture;
use Model\Ujian\LecturePeriod;
use Model\Ujian\Location;
use Model\Ujian\Participant;
use PHPUnit\Framework\TestCase;

class ExaminationTest extends TestCase
{

    protected
        /**
         * @var Lecture Lecture object
         */
        $lecture = null,
        /**
         * @var LecturePeriod Lecture periode object
         */
        $lecturePeriode = null,
        /**
         * @var Location
         */
        $location = null,
        /**
         * @var Computer
         */
        $computer = null;

    protected function setUp(): void
    {
        // create a lecture periode and new lecture just for test case.
        $lecture = new Lecture();
        $lecture->copyfrom([
            "name" => "Rescue Exam",
            "lecture_code" => "HXH98001",
        ]);
        $lecture->save();
        $this->lecture = $lecture;


        $lecturePeriode = LecturePeriod::getLatestPeriod(); // auto generated.
        $this->lecturePeriode = $lecturePeriode;

        // adding location for computer to reside
        $location = new Location();
        $location->copyfrom([
            "room_name" => "Zoldyck's Family",
            "name_alias" => "zoldyck"
        ]);
        $location->save();
        $this->location = $location;

        // add computer for self.
        $computer = new Computer();
        $computer->copyfrom([
            "name" => "Testing Gate",
            "ip" => "127.14.0.1",
            "reverse_dns" => "localhost",
            "d_pos" => json_encode([]),
            "location" => $location->_id,
        ]);
        $computer->save();
        $this->computer = $computer;
    }

    protected function tearDown(): void
    {
        // check if lecture periode is used in examniation
        $exam = new Exam();
        $exam->load(["lecture_period = ?", $this->lecturePeriode->_id]);
        if ($exam->loaded() == 0) {
            // delete them as nothing is using them
            $this->lecturePeriode->erase();
        }

        // remove lecture periode and lecture that are used on test case.
        $this->lecture->erase();

        $this->computer->erase();
        $this->location->erase();
    }


    /** 
     * @test
     * @testdox Activated exam should be able to be obtained
     * 
     * Exam should return an examination object when exam is active, within
     * timeframe and queried.
     */
    public function ActiveExamfunction()
    {
        $exam = new Exam();
        $exam->copyfrom([
            "lecture_period" => $this->lecturePeriode->_id,
            "time_start" => strtotime("-1 hour"),
            "time_duration" => 3600 * 2, // a day
            "lecture" => $this->lecture->_id,
            "time_opened" => strtotime("-1 hour"),
            "time_ended" => strtotime("+" . (3600 * 2) . " seconds"),
            "uts" => 0,
            "shift" => null, // no shift!
        ]);
        $exam->save();

        $participant = new Participant();
        $participant->copyfrom([
            "username" => "gon",
            "npm" => "109824803287",
            "exam" => $exam->_id,
            "computer" => $this->computer->_id
        ]);
        $participant->save();
        // var_dump($participant->cast());

        $participantTest = Participant::getActiveParticipant(true, $this->computer->ip);
        $this->assertNull($participantTest, "Shouldn't be able to get exam data with upcoming flag active");

        $participantTest = Participant::getActiveParticipant(false, $this->computer->ip);
        // die(\Base::instance()->DB->log());
        $this->assertIsObject($participantTest);
        $this->assertEquals($participant->_id, $participantTest->_id, "Able to fetch exam with explicitly removed upcoming flag");

        // delete exam and participant
        $exam->erase();
        $participant->erase();
    }


    /** 
     * @test
     * @testdox  Upcoming exam should be able to obtained with `upcoming` parameter only.
     */
    public function UpcomingExamfunction()
    {
        $exam = new Exam();
        $exam->copyfrom([
            "lecture_period" => $this->lecturePeriode->_id,
            "time_start" => strtotime("+5 minutes"),
            "time_opened" => null,
            "time_ended" => null,
            "time_duration" => 3600 * 2, // a day
            "lecture" => $this->lecture->_id,
            "uts" => 0,
            "shift" => null, // no shift!
        ]);
        $exam->save();

        $participant = new Participant();
        $participant->copyfrom([
            "username" => "gon",
            "npm" => "109824803287",
            "exam" => $exam->_id,
            "computer" => $this->computer->_id
        ]);
        $participant->save();

        $participantTest = Participant::getActiveParticipant(true, $this->computer->ip);
        $this->assertIsObject($participantTest);
        // $this->assertEquals(1, count($participantTest), "Able to get upcoming examination data");
        $this->assertEquals($participant->_id, $participantTest->_id, "Exam data is same");

        $participantTest = Participant::getActiveParticipant(false, $this->computer->ip);
        $this->assertNull($participantTest);
        // $this->assertEquals(0, count($participantTest), "Able to explicitly remove upcoming exam data");

        // delete exam and participant
        $exam->erase();
        $participant->erase();
    }

    /** 
     * @test
     * @testdox Closed exam should not appear on result.
     */
    public function PostExamfunction()
    {
        $exam = new Exam();
        $exam->copyfrom([
            "lecture_period" => $this->lecturePeriode->_id,
            "time_start" => strtotime("-1 day"),
            "time_duration" => 3600 * 20, // a day
            "time_opened" => strtotime("-1 day"),
            "time_ended" => strtotime("+" . (3600 * 20) . " seconds", strtotime("-1 day")),
            "lecture" => $this->lecture->_id,
            "uts" => 0,
            "shift" => null, // no shift!
        ]);
        $exam->save();

        $participant = new Participant();
        $participant->copyfrom([
            "username" => "gon",
            "npm" => "109824803287",
            "exam" => $exam->_id,
            "computer" => $this->computer->_id
        ]);
        $participant->save();

        $participantTest = Participant::getActiveParticipant(true, $this->computer->ip);
        $this->assertNull($participantTest);
        // $this->assertEquals(0, count($participantTest), "Able to get upcoming examination data");

        $participantTest = Participant::getActiveParticipant(false, $this->computer->ip);
        $this->assertNull($participantTest);
        // $this->assertEquals(0, count($participantTest), "Able to explicitly remove upcoming exam data");

        // delete exam and participant
        $exam->erase();
        $participant->erase();
    }
}
