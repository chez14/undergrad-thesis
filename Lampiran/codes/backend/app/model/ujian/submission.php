<?php

namespace Model\Ujian;

/**
 * @property Participant $participant
 * @property AnswerSlot $answer_slot
 * @property string $stored_filename
 */
class Submission extends \Model\ModelBase
{
    protected
        $fieldConf = array(
            'participant' => [
                'belongs-to-one' => '\Model\Ujian\Participant',
                '_copyable' => true
            ],
            'answer_slot' => [
                'belongs-to-one' => '\Model\Ujian\AnswerSlot',
                '_copyable' => true
            ],
            'stored_filename' => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
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
        $table = 'ujian_submission';

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

    public function cast($obj = NULL, $rel_depths = 1, $save_cast = true)
    {
        $obj = parent::cast($obj, $rel_depths);
        if (!$save_cast) {
            return $obj;
        } else {
            unset($obj['stored_filename']);
            return $obj;
        }
    }

    public function save()
    {
        if (!$this->created_on)
            $this->created_on = time();
        if (!$this->stored_filename)
            $this->stored_filename = bin2hex(random_bytes(16));
        $this->updated_on = time();
        return parent::save();
    }

    public function getFullPath()
    {
        return $this->participant->exam->getFullPath() . DIRECTORY_SEPARATOR . $this->stored_filename;
    }

    public function touch($key = "updated_on", $timestamp = null)
    {
        parent::touch($key, $timestamp);
    }
}
