<?php

namespace Controller;

use Model\Error;
use InvalidArgumentException;
use Model\System\AclItem;
use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Validator as v;

abstract class CRUDBase extends Api\Base
{

    protected $publicPermission = \Model\System\AclItem::NONE;
    protected $permissionPrefix = "";
    protected $model = null;

    public function globalFilterTrigger($model): void
    {
    }

    /**
     * Checks various things before we get started. If we check that this API
     * is not for public to use, then we will need to check the user to be logged in
     * with proper authentication.
     *
     * @param [type] $f3
     * @return void
     */
    public function beforeroute($f3)
    {
        parent::beforeroute($f3);
        v::with("\\Helper\\Rules");
        if ($this->publicPermission == \Model\System\AclItem::NONE) {
            return \Helper\Ijin::userMustPresent();
        }
    }

    /**
     * Checks the permission of current user, if no user logged in,
     * we'll check from public permission.
     *
     * @param string $what ACL Name
     * @param string $mode CRUD mode selection
     * @return void
     */
    protected function permission_check($what, $mode)
    {
        $user = \Model\System\User::getFromHTTPHeader();
        if (!$user && ($this->publicPermission & $mode) == 0) {
            throw new Error("Bad Auth", "You don't have permission to do that.", "403", "Bad Permission", 403);
        }

        return \Helper\Ijin::mustHave($what, $mode);
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
        $this->globalFilterTrigger($model);
        if (in_array("deleted_on", $model->fields())) {
            $models = $model->find(["deleted_on = ?", null]);
        } else {
            $models = $model->find();
        }
        if ($models === false) {
            $models = [];
        } else {
            $models = $models->castAll();
        }
        return \View\Api::success($models);
    }

    protected function getMentionedItem($f3)
    {
        // id from param must be exists
        $validator = v::key("id", v::notOptional()->mustExists($this->model, 'id', 'deleted_on'));
        try {
            $validator->assert($f3->PARAMS);
        } catch (NestedValidationException $e) {
            throw \Helper\Ruler::transformToError($e);
        }
        $model = new $this->model;
        $this->globalFilterTrigger($model);
        $model->load(["id = ?", $f3->PARAMS['id']]);

        if ($model->dry()) {
            throw new Error("Object not found", "Object cannot be found", "HTTP404", "Global Validation", 404);
        }

        return $model;
    }

    /**
     * Get information of an object, with given ID.
     *
     * @param object $f3
     * @return void
     */
    public function get_item($f3)
    {
        // permission checkpoint
        $this->permission_check($this->permissionPrefix, AclItem::READ);

        // id from param must be exists
        $validator = v::key("id", v::notOptional()->mustExists($this->model, 'id', 'deleted_on'));
        try {
            $validator->assert($f3->PARAMS);
        } catch (NestedValidationException $e) {
            throw \Helper\Ruler::transformToError($e);
        }
        $model = new $this->model;
        $this->globalFilterTrigger($model);
        $model->load(["id = ?", $f3->PARAMS['id']]);

        if ($model->dry()) {
            throw new Error("Object not found", "Object cannot be found", "HTTP404", "Global Validation", 404);
        }

        return \View\Api::success($model->cast());
    }

    /**
     * Create an item with given object.
     *
     * @param object $f3 FatFree Object
     * @return void
     */
    public function post_index($f3)
    {
        // permission checkpoint
        $this->permission_check($this->permissionPrefix, AclItem::CREATE);

        // create new object of model
        $obj = [];
        try {
            $model = new $this->model;
            $model->_validate($f3->POST);
            $model->copyfromwithfilter($f3->POST, true);
            $model->save();
            $obj = $model->cast();
        } catch (NestedValidationException $e) {
            throw \Helper\Ruler::transformToError($e);
        } catch (InvalidArgumentException $e) {
            throw new Error(
                "Bad Request",
                $e->getMessage(),
                "400",
                "Precheck Validation",
                405
            );
        }
        return \View\Api::success($obj);
    }

    /**
     * Update an item with given ID.
     *
     * @param object $f3 FatFree Object
     * @return void
     */
    public function put_item($f3)
    {
        // permission checkpoint
        $this->permission_check($this->permissionPrefix, AclItem::UPDATE);

        // create new object of model
        $validator = v::key("id", v::notOptional()->mustExists($this->model, 'id', 'deleted_on'));
        $obj = [];
        try {
            $validator->assert($f3->PARAMS);
            $model = new $this->model;
            $model->_validate($f3->POST);
            $this->globalFilterTrigger($model);
            $model->load(["id=?", $f3->PARAMS['id']]);
            if ($model->dry()) {
                throw new InvalidArgumentException("Global validation failed");
            }
            $model->copyfromwithfilter(array_diff_key($f3->POST, array_reverse(['id', '_id'])), true);
            $model->save();
            $obj = $model->cast();
        } catch (NestedValidationException $e) {
            throw \Helper\Ruler::transformToError($e);
        } catch (InvalidArgumentException $e) {
            throw new Error(
                "Bad Request",
                $e->getMessage(),
                "400",
                "Precheck Validation",
                405
            );
        }
        return \View\Api::success($obj);
    }

    /**
     * Delete and Item with given Object ID
     *
     * @param object $f3 FatFree Object
     * @return void
     */
    public function delete_item($f3, $directDelete = false)
    {
        // permission checkpoint
        $this->permission_check($this->permissionPrefix, AclItem::DELETE);

        // id from param must be exists
        $validator = v::key("id", v::notOptional()->mustExists($this->model, 'id', 'deleted_on'));
        try {
            $validator->assert($f3->PARAMS);
        } catch (NestedValidationException $e) {
            throw \Helper\Ruler::transformToError($e);
        }
        $model = new $this->model;
        if (!in_array("deleted_on", $model->fields()) && !$directDelete) {
            throw new Error(
                "Method not allowed",
                "Object cannot be deleted",
                "405",
                "Precheck Validation",
                405
            );
        }

        $this->globalFilterTrigger($model);
        $model->load(["id = ?", $f3->PARAMS['id']]);
        if ($model->dry()) {
            throw new Error(
                "Object not Found",
                "Object cannot be deleted",
                "404",
                "Precheck Validation",
                404
            );
        }
        if ($directDelete) {
            $model->erase();
        } else {
            $model->deleted_on = time();
            $model->save();
        }

        return \View\Api::success($model->cast());
    }
}
