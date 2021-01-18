<?php

namespace Controller\Api\Manage;

use Controller\CRUDBase;
use InvalidArgumentException;
use Model\Error;
use Model\System\AclItem;
use Model\Ujian\Notification as UjianNotification;
use Model\Ujian\Participant;
use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Validator as v;

class Notification extends CRUDBase
{
    protected $permissionPrefix = "manage-ujian-notification";
    protected $model = "\\Model\\Ujian\\Notification";

    public function delete_item($f3, $directDelete = true)
    {
        parent::delete_item($f3, $directDelete);
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

        $model = new $this->model;
        if (in_array("deleted_on", $model->fields())) {
            $models = $model->find(["deleted_on = ?", null]);
        } else {
            $models = $model->find();
        }
        if ($models === false) {
            $models = [];
        } else {
            $models = array_map(function ($model) {
                return $model->cast(null, null, false);
            }, (array) $models);
        }
        return \View\Api::success($models);
    }


    /**
     * Generate massive notification for participants.
     * 
     * 
     * Protocol design (multiple?):
     * - Create new exam
     * - Create participant_id - password list??
     * - Create new notifications
     * - Hook them to participants?
     * 
     * 
     * Other (single):
     * - Create new notification via API
     * - Add participant ids.
     * 
     */
    public function post_mass_gen($f3)
    {
        // template check?
        $this->permission_check($this->permissionPrefix, AclItem::READ);
        try {
            // id from param must be exists
            $validator = v::key("lists", v::each(
                v::key("participant", v::notOptional()->mustExists("\\Model\\Ujian\\participant", 'id', 'deleted_on'))
                    ->key("username", v::notOptional())
                    ->key("password", v::notOptional())
            ))
                ->key("url", v::notOptional());
            $validator->assert($f3->POST);


            // template is from notifications/password.html
            $service = $f3->POST['url'];
            $lists = $f3->POST['lists'];
            foreach ($lists as $l) {
                $participant = new Participant();
                $participant->load(["id=?", $l['participant']]);
                $notification = new UjianNotification();
                $notification->copyfrom([
                    "title" => "Akun untuk " . $service,
                    "type" => "credential",
                    "description" => \Template::instance()->render("notifications/password.html", 'text/html', [
                        "notif" => [
                            "url" => $service,
                            "username" => $l['username'],
                            "password" => $l['password'],
                        ]
                    ]),
                    "participants" => $participant,
                    "extras" => [
                        "service" => $service,
                        "username" => $l['username'],
                        "password" => $l['password'],
                    ]
                ]);
                $notification->save();
                // done.
            }
            
            return \View\Api::success([]);
        } catch (NestedValidationException $e) {
            throw \Helper\Ruler::transformToError($e);
        } catch (InvalidArgumentException $e) {
            throw new Error("Invalid Input", $e->getMessage(), "X400", "Exception", 400);
        }
    }
}
