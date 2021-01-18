<?php

namespace Helper\Rules;

use Respect\Validation\Rules\AbstractRule;

class MustExists extends AbstractRule
{

    protected $modelName, $fieldName, $deleted_on_field;

    public function __construct($modelName, $fieldName = 'id', $deleted_on_field = null)
    {
        $this->modelName = $modelName;
        $this->fieldName = $fieldName;
        $this->deleted_on_field = $deleted_on_field;
    }

    public function validate($input)
    {
        $model = new $this->modelName;
        $id = $input;
        if ($this->fieldName == null) {
            if (is_array($input) && array_key_exists('_id', $input)) {
                $id = $input->_id;
                $this->fieldName = "_id";
            }
            if (is_array($input) && array_key_exists('id', $input)) {
                $id = $input->id;
                $this->fieldName = "id";
            }
        } else {
            if (is_array($input) && array_key_exists($this->fieldName, $input)) {
                $id = $input->{$this->fieldName};
            }
        }

        if ($this->deleted_on_field && in_array($this->deleted_on_field, $model->fields())) {
            $model->load([$this->fieldName . ' = ? AND ' . $this->deleted_on_field . " = ?", $id, null]);
        } else {
            $model->load([$this->fieldName . ' = ?', $id]);
        }
        return $model->loaded();
    }
}
