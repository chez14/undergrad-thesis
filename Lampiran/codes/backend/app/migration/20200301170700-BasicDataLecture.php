<?php

namespace Migration;

/**
 * Migration Example
 * Please read more documentation on https://github.com/chez14/f3-ilgar
 */
class BasicDataLecture extends \Chez14\Ilgar\MigrationPacket
{
    public function on_migrate()
    {
        $lectures = [
            [
                "lecture_code" => "AIF181100",
                "name" => "Dasar-dasar Pemrograman"
            ],
            [
                "lecture_code" => "AIF182106",
                "name" => "Desain dan Analisis Algoritma"
            ],
            [
                "lecture_code" => "AIF183236",
                "name" => "Sertifikasi Administrasi Jaringan Komputer 2"
            ],
            [
                "lecture_code" => "AIF184222",
                "name" => "Sertifikasi Administrasi Jaringan Komputer 4"
            ],
            [
                "lecture_code" => "PHY183304",
                "name" => "Kapita Selekta Fisika Medis"
            ],
            [
                "lecture_code" => "AIF183002",
                "name" => "Penulisan Ilmiah"
            ],
            [
                "lecture_code" => "AIF182302",
                "name" => "Manajemen Informasi dan Basis Data"
            ],
            [
                "lecture_code" => "AIF183240",
                "name" => "Sertifikasi Cyber Ops"
            ],
            [
                "lecture_code" => "AIF182101",
                "name" => "Algoritma dan Struktur Data"
            ],
            [
                "lecture_code" => "AMS182704",
                "name" => "Komputasi Matematika"
            ],
            [
                "lecture_code" => "PHY181024",
                "name" => "Fisika Komputasi"
            ],
            [
                "lecture_code" => "AIF183153",
                "name" => "Metode Numerik"
            ],
            [
                "lecture_code" => "AIF183123",
                "name" => "Topik Khusus  Informatika 1"
            ],
            [
                "lecture_code" => "AMS181802",
                "name" => "Pemrograman Komputer"
            ],
            [
                "lecture_code" => "AIF182204",
                "name" => "Pemrograman Berbasis Web"
            ],
            [
                "lecture_code" => "AIF183300",
                "name" => "Teknologi Basis Data"
            ]
        ];

        // removing all lecture from DB to clean up things
        $db = \Base::instance()->get("DB");
        $db->exec("UPDATE ujian_exam SET deleted_on=NOW()");

        foreach ($lectures as $lecture) {
            $lec = new \Model\Ujian\Lecture();
            $lec->copyfrom($lecture);
            $lec->save();
        }
    }

    public function on_failed(\Exception $e)
    {
    }
}
