<?php

namespace Model;

use InvalidArgumentException;
use Respect\Validation\Validator as v;

class ModelBase extends \DB\Cortex
{
    static $validators;
    public function __construct($db = NULL, $table = NULL, $fluid = NULL, $ttl = 0)
    {
        parent::__construct($db, $table, $fluid, $ttl);
        v::with("\\Helper\\Rules");

        if (!self::$validators)
            self::$validators = [
                \DB\SQL\Schema::DT_BOOL     => v::oneOf(v::boolType(), v::intVal()->boolVal()),
                \DB\SQL\Schema::DT_BOOLEAN  => v::oneOf(v::boolType(), v::intVal()->boolVal()),
                \DB\SQL\Schema::DT_INT1     => v::intVal(),
                \DB\SQL\Schema::DT_TINYINT  => v::intVal(),
                \DB\SQL\Schema::DT_INT2     => v::intVal(),
                \DB\SQL\Schema::DT_SMALLINT     => v::intVal(),
                \DB\SQL\Schema::DT_INT4     => v::intVal(),
                \DB\SQL\Schema::DT_INT  => v::intVal(),
                \DB\SQL\Schema::DT_INT8     => v::intVal(),
                \DB\SQL\Schema::DT_BIGINT   => v::intVal(),
                \DB\SQL\Schema::DT_FLOAT    => v::floatVal(),
                \DB\SQL\Schema::DT_DOUBLE   => v::floatVal(),
                \DB\SQL\Schema::DT_DECIMAL  => v::floatVal(),
                \DB\SQL\Schema::DT_VARCHAR128   => v::stringType(),
                \DB\SQL\Schema::DT_VARCHAR256   => v::stringType(),
                \DB\SQL\Schema::DT_VARCHAR512   => v::stringType(),
                \DB\SQL\Schema::DT_TEXT     => v::stringType(),
                \DB\SQL\Schema::DT_LONGTEXT     => v::stringType(),
                \DB\SQL\Schema::DT_DATE     => v::oneOf(v::date(), v::intType()),
                \DB\SQL\Schema::DT_DATETIME     => v::oneOf(v::date("Y-m-d H:i:s"), v::intType()),
                \DB\SQL\Schema::DT_TIMESTAMP    => v::oneOf(v::date("Y-m-d H:i:s"), v::intType()),
                \DB\SQL\Schema::DT_BLOB     => v::alwaysValid(),
                \DB\SQL\Schema::DT_BINARY   => v::alwaysValid(),
                self::DT_JSON => v::alwaysValid()
            ];
    }

    public function copyfromwithfilter($data, $strict = false)
    {
        //fintering.
        $allowed = [];
        foreach ($this->fieldConf as $key => $setting) {
            if (array_key_exists("_copyable", $setting) && $setting['_copyable']) {
                $allowed[] = $key;
            } else {
                if ($strict && array_key_exists($key, $data)) {
                    throw new InvalidArgumentException("$key should not be used.");
                }
            }
        }

        if ($strict && count($diff = array_diff_key($data, array_flip($allowed))) > 0) {
            throw new InvalidArgumentException(implode(",", array_keys($diff)) . " should not be used.");
        }

        return $this->copyfrom(array_intersect_key($data, array_flip($allowed)));
    }

    /**
     * Valdiate all models for models.
     *
     * @param array $data
     * @param string $mode
     * @return true if validated, exception otherwise.
     */
    public function _validate($data)
    {
        $validator = [];
        foreach ($this->fieldConf as $key => $setting) {
            if (array_key_exists("nullable", $setting) && $setting['nullable']) {
                continue;
            }
            if (array_key_exists("_copyable", $setting) && !$setting['_copyable']) {
                continue;
            }

            $vali = v::notOptional();
            if (array_key_exists("has-many", $setting)) {
                $vali = v::arrayType()->each(v::intVal()->mustExists($setting["has-many"][0], 'id', 'deleted_on'));
            } else if (array_key_exists($setting['type'], self::$validators)) {
                $vali = self::$validators[$setting['type']];
            } else {
                
            }

            $validator[] = v::key($key, $vali);
        }

        return v::allOf(...$validator)->assert($data);
    }
}
