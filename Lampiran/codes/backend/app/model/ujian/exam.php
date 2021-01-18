<?php

namespace Model\Ujian;

use Monolog\Handler\StreamHandler;
use Monolog\Logger;

class Exam extends \Model\ModelBase
{
    protected
        $fieldConf = array(
            'lecture_period' => [
                'belongs-to-one' => '\Model\Ujian\LecturePeriod',
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            'time_start' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            'time_ended' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => true,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            // WARNING: DURATION TIME SHOULD BE IN MINUTES.
            // TODO: Convert all usage of this column from seconds to minutes.
            'time_duration' => [
                'type' => \DB\SQL\Schema::DT_INT,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            // WARNING: OPEN = EXAM OPENED AND PEOPLE CAN SUBMIT
            'time_opened' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => true,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            'lecture' => [
                'belongs-to-one' => '\Model\Ujian\Lecture',
                'nullable' => false,
                '_copyable' => true
            ],
            'exam_uniqcode' => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => true,
                '_copyable' => false
            ],
            'uts' => [
                'type' => \DB\SQL\Schema::DT_BOOL,
                'default' => 1,
                '_copyable' => true
            ],
            'shift' => [
                'type' => \DB\SQL\Schema::DT_INT,
                'nullable' => true,
                'default' => null,
                '_copyable' => true
            ],
            'answer_slot' => [
                'nullable' => true,
                '_copyable' => false,
                'has-many' => ['\Model\Ujian\AnswerSlot', 'exam'],
            ],
            'participants' => [
                'nullable' => true,
                '_copyable' => false,
                'has-many' => ['\Model\Ujian\Participant', 'exam'],
                '_show-in-list' => false
            ],
            'exam_report' => [
                'nullable' => true,
                '_copyable' => false,
                'has-many' => ['\Model\Ujian\ExamReport', 'exam'],
            ],


            'deleted_on' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => true,
                'index' => false,
                'unique' => false,
            ],
            'created_on' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => true,
                'index' => false,
                'unique' => false,
            ],
            'updated_on' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => true,
                'index' => false,
                'unique' => false,
            ],

        ),
        $db = 'DB',
        $table = 'ujian_exam';

    public function __construct()
    {
        parent::__construct();

        $this->virtual("time_left", function ($dis) {
            if (!$dis->time_ended) {
                return $dis->time_duration;
            }

            return max(strtotime($dis->time_ended) - time(), 0);
        });
    }

    public function set_deleted_on($date)
    {
        return date("Y-m-d H:i:s", $date);
    }

    public function set_created_on($date)
    {
        return date("Y-m-d H:i:s", $date);
    }

    public function set_updated_on($date)
    {
        return date("Y-m-d H:i:s", $date);
    }

    public function set_time_opened($date)
    {
        if ($date === null) {
            return null;
        }
        return date("Y-m-d H:i:s", $date);
    }

    public function set_time_ended($date)
    {
        if ($date === null) {
            return null;
        }
        return date("Y-m-d H:i:s", $date);
    }

    public function set_time_start($date)
    {
        if (is_string($date)) {
            $date = strtotime($date);
        }
        return date("Y-m-d H:i:s", $date);
    }

    public function cast($obj = NULL, $rel_depths = 1, $save_cast = true)
    {
        $obj = parent::cast($obj, $rel_depths);
        if (!$save_cast) {
            return $obj;
        } else {
            unset($obj['exam_uniqcode']);
            return $obj;
        }
    }

    public function save()
    {
        if (!$this->created_on)
            $this->created_on = time();
        if (!$this->exam_uniqcode)
            $this->exam_uniqcode = bin2hex(random_bytes(16));
        if (!$this->lecture_period) {
            $this->lecture_period = LecturePeriod::getLatestPeriod()->_id;
        }
        $this->updated_on = time();
        return parent::save();
    }

    public function touch($key = 'updated_on', $timestamp = NULL)
    {
        parent::touch($key, $timestamp);
    }

    public function getFullPath()
    {
        $f3 = \Base::instance();

        $securedAsset = trim($f3->get("UPLOADS"), DIRECTORY_SEPARATOR);
        $securedAsset .= DIRECTORY_SEPARATOR . "secured_assets";
        $securedAsset .= DIRECTORY_SEPARATOR . $this->exam_uniqcode;

        if (!is_dir($securedAsset)) {
            mkdir($securedAsset, 0777, true);
        }

        return $securedAsset;
    }

    public function getLoggerInstance($loggerName = "general"): Logger
    {
        $log = new Logger($loggerName);
        $log->pushHandler(new StreamHandler($this->getFullPath() . DIRECTORY_SEPARATOR . "exam-log-essential.log", Logger::NOTICE));
        $log->pushHandler(new StreamHandler($this->getFullPath() . DIRECTORY_SEPARATOR . "exam-log-verbose.log", Logger::INFO));

        return $log;
    }
}
