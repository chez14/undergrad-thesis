<?php

namespace Model\Ujian;

class ExamReport extends \Model\ModelBase
{
    protected
        $fieldConf = array(
            'token' => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => true,
                'index' => true,
                'unique' => false,
                '_copyable' => false
            ],
            'tos' => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            'exam' => [
                'belongs-to-one' => '\Model\Ujian\Exam',
                'nullable' => false,
                '_copyable' => true
            ],


            'sent_on' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => true,
                'index' => false,
                'unique' => false,
            ],
            'valid_until' => [
                'type' => \DB\SQL\Schema::DT_DATETIME,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
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
        $table = 'ujian_exam_report';

    public function set_sent_on($date)
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

    public function set_valid_until($date)
    {
        return date("Y-m-d H:i:s", $date);
    }

    /**
     * Push validity period of the token
     *
     * @param integer $addSeconds Push validity duration in seconds
     * @param bool $autoSave (self exaplanatory)
     * @return void
     */
    public function pushValidity(int $addSeconds = 43200, bool $autoSave = true): void
    {
        $this->valid_until = max((time() + $addSeconds), $this->valid_until);
        if ($autoSave) {
            $this->save();
        }
    }

    public function save()
    {
        if (!$this->created_on) {
            $this->created_on = time();
        }

        if (!$this->token) {
            $this->token = bin2hex(random_bytes(16));
        }

        if (!$this->valid_until) {
            if ($this->exam) {
                $this->valid_until = $this->exam->time_ended;
            } else {
                $this->valid_until = time() + 43200; // add 12 hour from creation
            }
        }

        $this->updated_on = time();
        return parent::save();
    }
}
