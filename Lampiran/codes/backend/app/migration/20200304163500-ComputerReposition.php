<?php

namespace Migration;

use Model\Ujian\Computer;

/**
 * Migration Example
 * Please read more documentation on https://github.com/chez14/f3-ilgar
 */
class ComputerReposition extends \Chez14\Ilgar\MigrationPacket
{
    public function on_migrate()
    {
        $locations = [
            [
                "room_name" => "9018",
                "name_alias" => "Lab01",
                "_comp" => [ // kesaping X, kebawah Y!
                    [[1, 'l'], [8, 'r'], [15, 'l'], [22, 'r']],
                    [[2, 'l'], [9, 'r'], [16, 'l'], [23, 'r'], [29, 'l'], [35, 'r']],
                    [[3, 'l'], [10, 'r'], [17, 'l'], [24, 'r'], [30, 'l'], [36, 'r']],
                    [[4, 'l'], [11, 'r'], [18, 'l'], [25, 'r'], [31, 'l'], [37, 'r']],
                    [[5, 'l'], [12, 'r'], [19, 'l'], [26, 'r'], [32, 'l'], [38, 'r']],
                    [[6, 'l'], [13, 'r'], [20, 'l'], [27, 'r'], [33, 'l'], [39, 'r']],
                    [[7, 'l'], [14, 'r'], [21, 'l'], [28, 'r'], [34, 'l'], [40, 'r']],
                ],
                "_ip_prefix" => "10.100.71.2"
            ],
            [
                "room_name" => "9017",
                "name_alias" => "Lab02",
                "_comp" => [
                    [[40, 'l'], [33, 'r'], [25, 'l'], [17, 'r'], [9, 'l'], [1, 'r']],
                    [[41, 'l'], [34, 'r'], [26, 'l'], [18, 'r'], [10, 'l'], [2, 'r']],
                    [[42, 'l'], [35, 'r'], [27, 'l'], [19, 'r'], [11, 'l'], [3, 'r']],
                    [[43, 'l'], [36, 'r'], [28, 'l'], [20, 'r'], [12, 'l'], [4, 'r']],
                    [[44, 'l'], [37, 'r'], [29, 'l'], [21, 'r'], [13, 'l'], [5, 'r']],
                    [[45, 'l'], [38, 'r'], [30, 'l'], [22, 'r'], [14, 'l'], [6, 'r']],
                    [[null], [39, 'r'], [31, 'l'], [23, 'r'], [15, 'l'], [7, 'r']],
                    [[null], [null], [32, 'l'], [24, 'r'], [16, 'l'], [8, 'r']],
                ],
                "_ip_prefix" => "10.100.72.2"
            ],
            [
                "room_name" => "9016",
                "name_alias" => "Lab03",
                "_comp" => [
                    [[1, 'l'], [8, 'r'], [15, 'l'], [22, 'r'], [29, 'l']],
                    [[2, 'l'], [9, 'r'], [16, 'l'], [23, 'r'], [30, 'l']],
                    [[3, 'l'], [10, 'r'], [17, 'l'], [24, 'r'], [31, 'l']],
                    [[4, 'l'], [11, 'r'], [18, 'l'], [25, 'r'], [32, 'l']],
                    [[5, 'l'], [12, 'r'], [19, 'l'], [26, 'r'], [33, 'l']],
                    [[6, 'l'], [13, 'r'], [20, 'l'], [27, 'r'], [34, 'l']],
                    [[7, 'l'], [14, 'r'], [21, 'l'], [28, 'r'], [35, 'l']],
                ],
                "_ip_prefix" => "10.100.73.2"
            ],
            [
                "room_name" => "9015",
                "name_alias" => "Lab04",
                "_comp" => [
                    [[29, 'r'], [22, 'l'], [15, 'r'], [8, 'l'], [1, 'r']],
                    [[30, 'r'], [23, 'l'], [16, 'r'], [9, 'l'], [2, 'r']],
                    [[31, 'r'], [24, 'l'], [17, 'r'], [10, 'l'], [3, 'r']],
                    [[32, 'r'], [25, 'l'], [18, 'r'], [11, 'l'], [4, 'r']],
                    [[33, 'r'], [26, 'l'], [19, 'r'], [12, 'l'], [5, 'r']],
                    [[34, 'r'], [27, 'l'], [20, 'r'], [13, 'l'], [6, 'r']],
                    [[35, 'r'], [28, 'l'], [21, 'r'], [14, 'l'], [7, 'r']],
                ],
                "_ip_prefix" => "10.100.74.2"
            ]
        ];

        // removing all lecture from DB to clean up things
        $db = \Base::instance()->get("DB");
        $db->exec("truncate ujian_computer");
        foreach ($locations as $location) {
            $loc = new \Model\Ujian\Location();
            $loc->load(["room_name = ?", $location['room_name']]);
            if ($loc->dry()) {
                continue;
            }

            $y = 1;
            foreach ($location['_comp'] as $comp_row) {
                $x = 0;
                $y++;
                foreach ($comp_row as $comp) {
                    $x++;

                    if ($comp[0] == null) {
                        continue; // blankster
                    }
                    $computer = new Computer();
                    $computer->copyfrom([
                        "name" => $loc->name_alias . "-" . sprintf("%02d", $comp[0]),
                        "ip" => $location['_ip_prefix'] . sprintf("%02d", $comp[0]),
                        "reverse_dns" => strtolower($loc->name_alias . "-" . sprintf("%02d.ftis.unpar", $comp[0])),
                        "d_pos" => ["x" => $x, "y" => $y, "orient" => $comp[1]],
                        "location" => $loc->_id
                    ]);
                    $computer->save();
                }
            }
        }
    }

    public function on_failed(\Exception $e)
    {
    }
}
