<?php

namespace Migration;

/**
 * Migration Example
 * Please read more documentation on https://github.com/chez14/f3-ilgar
 */
class BasicDataRoom extends \Chez14\Ilgar\MigrationPacket
{
    public function on_migrate()
    {
        $locations = [
            [
                "room_name" => "9018",
                "name_alias" => "Lab01",
                "_comp" => 40,
                "_ip_prefix" => "10.100.71.2"
            ],
            [
                "room_name" => "9017",
                "name_alias" => "Lab02",
                "_comp" => 45,
                "_ip_prefix" => "10.100.72.2"
            ],
            [
                "room_name" => "9016",
                "name_alias" => "Lab03",
                "_comp" => 35,
                "_ip_prefix" => "10.100.73.2"
            ],
            [
                "room_name" => "9015",
                "name_alias" => "Lab04",
                "_comp" => 35,
                "_ip_prefix" => "10.100.74.2"
            ]
        ];

        // removing all lecture from DB to clean up things
        $db = \Base::instance()->get("DB");

        foreach ($locations as $location) {
            $loc = new \Model\Ujian\Location();
            $comp = $location['_comp'];
            $ip = $location['_ip_prefix'];
            unset($location['_comp']);
            unset($location['_ip_prefix']);

            $loc->copyfrom($location);
            $loc->save();

            // for ($i = 1; $i <= $comp; $i++) {
            //     $computer = new \Model\Ujian\Computer();
            //     $computer->copyfrom([
            //         "name" => $loc->name_alias . "-" . sprintf("%02d", $i),
            //         "ip" => $ip . sprintf("%02d", $i),
            //         "reverse_dns" => strtolower($loc->name_alias . "-" . sprintf("%02d.ftis.unpar", $i)),
            //         "d_pos" => null,
            //         "location" => $loc->_id
            //     ]);
            //     $computer->save();
            // }
        }
    }

    public function on_failed(\Exception $e)
    {
    }
}
