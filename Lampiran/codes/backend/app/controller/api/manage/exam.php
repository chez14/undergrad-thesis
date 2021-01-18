<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;
use Exception\NotParseable;
use Helper\AnswerZipper;
use InvalidArgumentException;
use Model\Error;
use Model\System\AclItem;
use Model\System\User;
use Model\Ujian\Notification;
use Model\Ujian\Participant;
use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Validator as v;

class Exam extends CRUDBase
{
    protected $permissionPrefix = "manage-ujian-exam";
    protected $model = "\\Model\\Ujian\\Exam";

    public function globalFilterTrigger($model): void
    {
        // Check if user is IPLogin user.
        $iplogin = User::getIPLoginHTTPHeader();
        if ($iplogin === null) {
            return;
        }

        // get room:
        $location = array_map(function ($data) {
            return $data->_id;
        }, (array)$iplogin->locations);

        $model->has('participants.computer', ["location in (?)", $location]);
    }

    /**
     * List all object in a model.
     * May support search and paging. But not sure.
     *
     * @param object $f3 FatFree Object
     * @return void
     */
    public function get_index($f3)
    {
        // permission checkpoint
        $this->permission_check($this->permissionPrefix, AclItem::READ);

        $upcomingTimeMinutes = 10;

        $model = new $this->model;
        $this->globalFilterTrigger($model);
        if ($f3->exists('GET.screenmode')) {
            $models = $model->find([
                "(time_start >= ? or time_ended >= ?) and deleted_on = ?",
                date('Y-m-d H:i:s', strtotime(("-$upcomingTimeMinutes minute"))),
                date('Y-m-d H:i:s', strtotime(("-$upcomingTimeMinutes minute"))),
                null
            ], ["order" => "time_start ASC"]);
        } else {
            $models = $model->find(["deleted_on = ?", null]);
        }

        if ($models === false) {
            $models = [];
        } else {
            $models = $models->castAll();
        }
        return \View\Api::success($models);
    }

    public function get_item_notifications(\Base $f3)
    {
        $this->permission_check($this->permissionPrefix, AclItem::READ);
        $this->permission_check($this->permissionPrefix, AclItem::READ);
        $ujian = parent::getMentionedItem($f3);

        $notif = new Notification();
        $notif->has("participants", ["exam=?", $ujian->_id]);
        $notifs = $notif->find();

        if (!$notifs) {
            $notifs = [];
        }

        return \View\Api::success(array_map(function ($data) {
            return $data->cast(null, null, false);
        }, (array) $notifs));
    }

    public function get_item_participants(\Base $f3)
    {
        $this->permission_check($this->permissionPrefix, AclItem::READ);
        $ujian = parent::getMentionedItem($f3);

        $participant = new \Model\Ujian\Participant();
        $participant->fields(["exam"], true);
        $participants = $participant->find(["exam = ? and deleted_on = ?", $ujian->_id, null]);

        if (!$participants) {
            $participants = [];
        } else {
            $participants = $participants->castAll();
        }

        return \View\Api::success($participants);
    }

    public function post_item_populate(\Base $f3)
    {
        // permission checkpoint
        $this->permission_check($this->permissionPrefix, AclItem::UPDATE);
        $ujian = parent::getMentionedItem($f3);

        $logger = $ujian->getLoggerInstance();
        $logger->notice("Exam participants getting populated...");
        try {
            // id from param must be exists
            $validator = v::key("computers", v::notOptional()->each(v::mustExists("\\Model\\Ujian\\Computer", 'id', 'deleted_on')))
                ->key("participants", v::notOptional())
                ->key("should_cleanup", v::boolVal(), false);
            $validator->assert($f3->POST);

            if (array_key_exists("should_cleanup", $f3->POST) && $f3->POST['should_cleanup']) {
                $pastParticipants = (new Participant())->find(["exam = ?", $ujian->_id]);
                foreach ((array) $pastParticipants as $par) {
                    $par->deleted_at = time();
                    $par->save();
                }
            }

            $computers = $f3->POST['computers'];
            $participants = $f3->POST['participants'];

            try {
                $participants = array_map(function ($par) {
                    $info = \Chez14\NpmParser\Solver::getInfo($par);
                    return [$par, $info];
                }, $participants);
            } catch (NotParseable $e) {
                throw new InvalidArgumentException("There's invalid participant NPM. Please recheck! ERR: " . $e->getMessage());
            }

            shuffle($participants);
            shuffle($computers);

            foreach ($participants as $parto) {
                $selectedComp = array_pop($computers);
                $transpiler = $f3->get('NPM_TRANSPILE');
                $username = substr($parto[1]['enrollment_year'], 2) . $parto[1]['no_urut'];

                if (array_key_exists($parto[1]['prodi_id'], $transpiler)) {
                    $username = $transpiler[$parto[1]['prodi_id']] . $username;
                } else {
                    throw new InvalidArgumentException("Unknown prodi_id " . $parto[1]['prodi_id'] . " from " . $parto[0]);
                }
                $participant = new Participant();
                $participant->copyfrom([
                    "username" => $username,
                    "npm" => $parto[0],
                    "exam" => $ujian->_id,
                    "computer" => $selectedComp
                ]);

                $participant->save();
                $logger->notice("Populate finished!");
            }
        } catch (NestedValidationException $e) {
            $logger->notice("Participant populate action is failed with Validation error: " + $e->getMessage());
            throw \Helper\Ruler::transformToError($e);
        } catch (InvalidArgumentException $e) {
            $logger->notice("Participant populate action is failed with Bad Request error: " + $e->getMessage());
            throw new Error("Invalid Input", $e->getMessage(), "X400", "Exception", 400);
        }


        // GENERATE THINGS.
        return \View\Api::success($ujian);
    }

    /**
     * Open answer slot for current exam and start the timer
     *
     * @param \Base $f3 FatFree instance
     * @return void
     */
    public function post_item_start(\Base $f3)
    {
        $this->permission_check($this->permissionPrefix, AclItem::UPDATE);
        $ujian = parent::getMentionedItem($f3);

        $ujian->time_opened = time();
        $ujian->time_ended = strtotime("+" . $ujian->time_duration . " seconds");
        $ujian->save();

        $logger = $ujian->getLoggerInstance();
        $logger->notice("Timer start via " . $f3->IP);


        return \View\Api::success($ujian->cast());
    }

    /**
     * Close answer slot for current exam and stop the timer
     *
     * @param \Base $f3
     * @return void
     */
    public function post_item_close(\Base $f3)
    {
        $this->permission_check($this->permissionPrefix, AclItem::UPDATE);
        $ujian = parent::getMentionedItem($f3);

        $ujian->time_ended = time();
        $ujian->save();

        $logger = $ujian->getLoggerInstance();
        $logger->notice("Timer (forced) stop via " . $f3->IP);

        return \View\Api::success($ujian->cast());
    }

    /**
     * Remove open/closed status for answer slot & timer on current exam.
     *
     * @param \Base $f3
     * @return void
     */
    public function delete_item_start(\Base $f3)
    {
        $this->permission_check($this->permissionPrefix, AclItem::UPDATE);
        $ujian = parent::getMentionedItem($f3);

        $ujian->time_start = time();
        $ujian->time_opened = null;
        $ujian->time_ended = null;
        $ujian->save();

        $logger = $ujian->getLoggerInstance();
        $logger->warn("Timer reset via " . $f3->IP);

        return \View\Api::success($ujian->cast());
    }

    /**
     * Generate deployment script for current exam
     *
     * @param \Base $f3
     * @return void
     */
    public function get_item_script(\Base $f3)
    {
        $this->permission_check($this->permissionPrefix, AclItem::READ);
        $ujian = parent::getMentionedItem($f3);
        $filename = $ujian->lecture->lecture_code . " - " . $ujian->lecture->name;

        if ($ujian->shift != 0) {
            $filename .= " Shift " . $ujian->shift;
        }

        $filename .= ".zip";

        $logger = $ujian->getLoggerInstance();
        $logger->info("Deployment script download via " . $f3->IP);

        header("X-Filename: $filename");
        \Web::instance()->send(
            \Service\BatGenerator::instance()->generate($ujian),
            null,
            0,
            true,
            $filename
        );
        \Service\BatGenerator::instance()->clean_zip();
    }

    /**
     * Zip answers for current exam and return it as attachment
     *
     * @param \Base $f3
     * @return void
     */
    public function get_item_answers(\Base $f3)
    {
        // zipping it all.
        $this->permission_check($this->permissionPrefix, AclItem::READ);
        $ujian = parent::getMentionedItem($f3);

        $zipname = AnswerZipper::zipExam($ujian);
        $filename = AnswerZipper::getProperFilename($ujian);

        $filename .= ".zip";

        $logger = $ujian->getLoggerInstance();
        $logger->warn("Answer download request via " . $f3->IP);

        header("X-Filename: $filename");
        \Web::instance()->send(
            $zipname,
            null,
            0,
            true,
            $filename
        );
        if (is_file($zipname)) {
            unlink($zipname);
        }
    }

    /**
     * Move lists of participants to specific computer
     *
     * @param \Base $f3
     * @return void
     */
    public function post_item_move(\Base $f3)
    {
        $this->permission_check($this->permissionPrefix, AclItem::UPDATE);
        $ujian = parent::getMentionedItem($f3);

        $logger = $ujian->getLoggerInstance();
        $logger->notice("Move sequence requested via" . $f3->IP);

        // get all position and it's destination.
        try {
            // id from param must be exists
            $validator = v::key("lists", v::each(
                v::key("participant", v::notOptional()->mustExists("\\Model\\Ujian\\Participant", 'id', 'deleted_on'))
                    ->key("to",  v::notOptional()->mustExists("\\Model\\Ujian\\Computer", 'id'))
            ));
            $validator->assert($f3->POST);

            $lists = $f3->POST['lists'];

            $migrationList = [];

            foreach ($lists as $list) {
                $computer = new \Model\Ujian\Computer();
                $participant = new \Model\Ujian\Participant();
                $computer->load(["id = ?", $list['to']]);
                $participant->load(["id = ?", $list['participant']]);
                if ($participant->exam->_id != $ujian->_id) {
                    throw new \InvalidArgumentException("Invalid participant on $list[participant]");
                }

                $logger->info("[MOVE] Participant " . $participant->npm . "(#" . $participant->_id . ") is being moved from " . $participant->computer->name . " to " . $computer->name);

                $migrationList[] = [
                    "p" => $participant,
                    "c_before" => $participant->computer,
                    "c_after" => $computer,
                ];
                $participant->computer = $computer->_id;
                // $participant->save();
            }

            foreach ($migrationList as $mig) {
                $mig['p']->save();
            }

            $logger->info("[MOVE] DB has been updated.");


            // generate script:
            $filename = "Migrasi "  . $ujian->lecture->lecture_code . " - " . $ujian->lecture->name;

            if ($ujian->shift != 0) {
                $filename .= " Shift " . $ujian->shift;
            }

            $filename .= date("Y-m-d H:i:s") . ".zip";

            $logger->info("[MOVE] Move script has been made.");

            header("X-Filename: $filename");
            \Web::instance()->send(
                \Service\BatGenerator::instance()->generateMigration($migrationList, $ujian),
                null,
                0,
                true,
                $filename
            );
            \Service\BatGenerator::instance()->clean_zip();
        } catch (NestedValidationException $e) {
            $logger->notice("Participant move action is failed with Validation error: " + $e->getMessage());
            throw \Helper\Ruler::transformToError($e);
        } catch (InvalidArgumentException $e) {
            $logger->notice("Participant move action is failed with Bad Request error: " + $e->getMessage());
            throw new Error("Invalid Input", $e->getMessage(), "X400", "Exception", 400);
        }
    }
}
