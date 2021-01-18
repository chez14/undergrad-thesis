<?php

use Model\Ujian\Computer;
use Model\Ujian\Exam;
use Model\Ujian\Lecture;
use Model\Ujian\LecturePeriod;
use Model\Ujian\Location;
use Model\Ujian\Participant;
use PHPUnit\Framework\TestCase;

class ExaminationWithShiftTest extends TestCase
{

    protected static
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


    public static function setUpBeforeClass(): void
    {
        // create a lecture periode and new lecture just for test case.
        $lecture = new Lecture();
        $lecture->copyfrom([
            "name" => "Rescue Exam",
            "lecture_code" => "HXH98001",
        ]);
        $lecture->save();
        self::$lecture = $lecture;


        $lecturePeriode = LecturePeriod::getLatestPeriod(); // auto generated.
        self::$lecturePeriode = $lecturePeriode;

        // adding location for computer to reside
        $location = new Location();
        $location->copyfrom([
            "room_name" => "Zoldyck's Family",
            "name_alias" => "zoldyck"
        ]);
        $location->save();
        self::$location = $location;

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
        self::$computer = $computer;
    }

    public static function tearDownAfterClass(): void
    {
        // check if lecture periode is used in examniation
        $exam = new Exam();
        $exam->load(["lecture_period = ?", self::$lecturePeriode->_id]);
        if ($exam->loaded() == 0) {
            // delete them as nothing is using them
            self::$lecturePeriode->erase();
        }

        // remove lecture periode and lecture that are used on test case.
        $exams = $exam->find(["lecture=?", self::$lecture->_id]);
        if ($exams === false) {
            $exams = [];
        }
        foreach ($exams as $e) {
            $participant = new Participant();
            $participants = $participant->find(["exam = ?", $e->_id]);
            foreach ($participants as $par) {
                $par->erase();
            }
            $e->erase();
        }
        self::$lecture->erase();

        self::$computer->erase();
        self::$location->erase();
    }

    /**
     * Generate Exam
     *
     * @return Exam
     */
    protected function generateBareExam($baseDate = "-10 minute")
    {
        $exam = new Exam();
        $exam->copyfrom([
            "lecture_period" => self::$lecturePeriode->_id,
            "time_start" => strtotime($baseDate),
            "time_duration" => 3600 * 3,
            "lecture" => self::$lecture->_id,
            "uts" => 0,
            "shift" => null, // no shift!
        ]);
        $exam->save();

        if (!self::$computer) {
            throw new Exception("COMPUTER UNSET!");
        }

        $participant = new Participant();
        $participant->copyfrom([
            "username" => "gon",
            "npm" => "109824803287",
            "exam" => $exam->_id,
            "computer" => self::$computer->_id
        ]);
        $participant->save();

        return $exam;
    }

    /**
     * Clean following examination
     *
     * @param Exam $exam
     * @return void
     */
    protected function cleanGeneratedExam($exam)
    {
        $participant = new Participant();
        $participants = $participant->find(["exam = ?", $exam->_id]);
        foreach ($participants as $par) {
            $par->erase();
        }
        $exam->erase();
    }

    protected function cleanAllExam()
    {
        $exam = new Exam();
        $exams = $exam->find(["lecture=?", self::$lecture->_id]);
        if ($exams === false) {
            $exams = [];
        }
        foreach ($exams as $e) {
            $participant = new Participant();
            $participants = $participant->find(["exam = ?", $e->_id]);
            foreach ($participants as $par) {
                $par->erase();
            }
            $e->erase();
        }
    }

    /**
     * Test data will consist of following arrays (AS CALLBACK!)
     *  - 0 => Shifts
     *  - 1 => Expected exam order
     *     - 0 => upcoming
     *     - 1 => active 
     *
     * @return array datas
     */
    public function examProvider(): array
    {
        $testData = [];
        // both are upcoming ======================================
        $testData[] = function () {
            // first shift
            $exam1 = $this->generateBareExam(); //normally upcoming
            $exam1->shift = 1;
            $exam1->save();

            // second shift
            $exam2 = $this->generateBareExam(); //normally upcoming
            $exam2->time_start = strtotime("+" . $exam1->time_duration . " seconds", strtotime($exam1->time_start));
            $exam2->shift = 2;
            $exam2->save();

            return [
                [$exam1, $exam2],
                [
                    $exam1,
                    null
                ]
            ];
        };

        // 1 is active, 1 is upcoming ================================
        $testData[] = function () {
            // first shift
            $exam1 = $this->generateBareExam("-175 minutes"); //normally upcoming
            $exam1->shift = 1;
            $exam1->time_ended = strtotime("+" . $exam1->time_duration . " seconds", strtotime($exam1->time_start));
            $exam1->time_opened = $exam1->time_start; // open the time
            $exam1->save();

            // second shift
            $exam2 = $this->generateBareExam("-5 minutes"); //normally upcoming
            $exam2->shift = 2;
            $exam2->save();

            return [
                [$exam1, $exam2],
                [
                    $exam2,
                    $exam1
                ]
            ];
        };

        // 1 is closed, 1 is upcoming ================================
        $testData[] = function () {
            // first shift
            $exam1 = $this->generateBareExam("-180 minutes"); //normally upcoming
            $exam1->shift = 1;
            $exam1->time_opened = $exam1->time_start;
            $exam1->time_ended = $exam1->time_start; // close the time
            $exam1->save();

            // second shift
            $exam2 = $this->generateBareExam(); //normally upcoming
            $exam2->shift = 2;
            $exam2->save();

            return [
                [$exam1, $exam2],
                [
                    $exam2,
                    null
                ]
            ];
        };

        // 1 is closed, 1 is active ==================================
        $testData[] = function () {
            // first shift
            $exam1 = $this->generateBareExam("-180 minutes"); //normally upcoming
            $exam1->shift = 1;
            $exam1->time_opened = $exam1->time_start;
            $exam1->time_ended = $exam1->time_start; // close the time
            $exam1->save();

            // second shift
            $exam2 = $this->generateBareExam(); //normally upcoming
            $exam2->shift = 2;
            $exam2->time_opened = $exam2->time_start;
            $exam2->time_ended = strtotime("+" . $exam2->time_duration . " seconds");
            $exam2->save();

            return [
                [$exam1, $exam2],
                [
                    null,
                    $exam2
                ]
            ];
        };

        // both are closed. ==========================================
        $testData[] = function () {
            // first shift
            $exam1 = $this->generateBareExam("-6 hours"); //normally upcoming
            $exam1->shift = 1;
            $exam1->time_opened = $exam1->time_start;
            $exam1->time_ended = $exam1->time_start; // close the time
            $exam1->save();

            // second shift
            $exam2 = $this->generateBareExam("-3 hours"); //normally upcoming
            $exam2->time_start = strtotime("+" . $exam1->time_duration . " seconds", strtotime($exam1->time_start));
            $exam2->shift = 2;
            $exam2->time_opened = $exam2->time_start;
            $exam2->time_ended = $exam2->time_start; // close the time
            $exam2->save();

            return [
                [$exam1, $exam2],
                [
                    null,
                    null
                ]
            ];
        };


        return array_map(function ($data) {
            return [$data];
        }, $testData);
    }


    /** 
     * @test
     * @testdox Exam shift test
     * 
     * @dataProvider examProvider
     * @skipTest
     */
    public function SuperExamTestfunction($dataCallback)
    {
        $this->cleanAllExam();
        $testcase = $dataCallback();

        $participantUpcoming = Participant::getActiveParticipant(true, self::$computer->ip);
        $participantActive = Participant::getActiveParticipant(false, self::$computer->ip);

        $expectedUpcoming = $testcase[1][0];
        $expectedActive = $testcase[1][1];

        // detect first
        if ($expectedUpcoming === null) {
            $this->assertNull($participantUpcoming);
        } else {
            $this->assertNotNull($participantUpcoming);
            $this->assertEquals($expectedUpcoming->_id, $participantUpcoming->_id, "Upcoming exam match");
        }

        if ($expectedActive === null) {
            $this->assertNull($participantActive);
        } else {
            $this->assertNotNull($participantActive);
            $this->assertEquals($expectedActive->_id, $participantActive->_id, "Active exam match");
        }

        // clearance.
        foreach ($testcase[0] as $exam) {
            $this->cleanGeneratedExam($exam);
        }
    }
}
