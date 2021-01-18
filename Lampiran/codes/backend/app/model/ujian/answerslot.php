<?php

namespace Model\Ujian;

class AnswerSlot extends \Model\ModelBase
{
    protected
        $fieldConf = array(
            'format' => [
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
            'submissions' => [
                'has-many' => ['\Model\Ujian\Submission', 'answer_slot'],
                'nullable' => true,
                '_copyable' => false
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
        $table = 'ujian_answer_slot';

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

    public function save()
    {
        if (!$this->created_on)
            $this->created_on = time();
        $this->updated_on = time();
        return parent::save();
    }

    /**
     * Simulate answer filename format. This will enables us to check between the filenames anwers.
     *
     * @param Participant $as_participant participant
     * @return string final format
     */
    public function simulateFormat(Participant $as_participant): string
    {
        return \preg_replace_callback("/\%([a-zA-Z0-9\_]+)\%/mi", function ($match) use ($as_participant) {
            if ($as_participant->{$match[1]}) {
                return $as_participant->{$match[1]};
            } else {
                return "-&&-"; // means it's imposibble.
            }
        }, $this->format);
    }

    public function getSubmission(Participant $participant): Submission
    {
        $submission = new \Model\Ujian\Submission();
        $submission->load(["participant = ? and answer_slot = ?", $participant->_id, $this->_id]);
        return $submission;
    }

    /**
     * Submit the answer for this answer slot.
     * This function will scramble the filename and save it into the abyss,
     * and return a submission object for a report.
     *
     * @param string $filepath Filepath to the temp
     * @param Participant $as_participant The participant that submits the answer.
     * @return Submission Submission obejct that holds the truth behind the abyss.
     */
    public function submit(string $filepath, Participant $as_participant): Submission
    {
        // detect submission
        $submission = new \Model\Ujian\Submission();
        $submission->load(["participant = ? and answer_slot = ?", $as_participant->_id, $this->_id]);
        if ($submission->dry()) {
            $submission->copyfrom([
                "participant" => $as_participant->_id,
                "answer_slot" => $this->_id
            ]);
            $submission->save();
        }

        // copy filepath:
        $fullpath = $submission->getFullPath();
        if (is_file(($fullpath))) { // remove existing file
            unlink($fullpath);
        }
        copy($filepath, $fullpath);

        $logger = $as_participant->exam->getLoggerInstance();
        $logger->warn("Participant " . $as_participant->npm . " (#" . $as_participant->_id . ") uploaded " . $this->simulateFormat($as_participant) . " via Submission#" . $submission->_id  . " on " . $f3->IP);

        // return the Submission
        return $submission;
    }

    public function cast($obj = NULL, $rel_depths = 1, $save_cast = true, Participant $as_participant = null)
    {
        $obj = parent::cast($obj, $rel_depths);

        if ($as_participant != null) {
            if ($as_participant->loaded() == 0) {
                throw new \Exception("Participant is dry.");
            }
            $obj['format'] = $this->simulateFormat($as_participant);
        }

        if (!$save_cast) {
            return $obj;
        } else {
            unset($obj['submissions']); //will prevent leaking information
            return $obj;
        }
    }
}
