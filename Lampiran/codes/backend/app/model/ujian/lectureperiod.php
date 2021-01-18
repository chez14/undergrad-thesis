<?php

namespace Model\Ujian;

class LecturePeriod extends \Model\ModelBase
{
    protected
        $fieldConf = array(
            'period_code' => [
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
        $table = 'ujian_lecture_period';

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

    public static function getLatestPeriod()
    {
        $periodeCode = date("Y");
        $bulan = date("m");

        if ($bulan < 6) {
            // genap
            $periodeCode =date("Y2", strtotime("-1 year"));
        } else if ($bulan < 7) {
            // SP
            $periodeCode .= "3";
        } else {
            // ganjil
            $periodeCode .= "1";
        }

        $object = new self();
        $object->load(["period_code = ?", $periodeCode]);
        if ($object->dry()) {
            $object->copyfrom([
                "period_code" => $periodeCode
            ]);
            $object->save();
        }

        return $object;
    }
}
