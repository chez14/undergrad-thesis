<?php

namespace Service;

class BatGenerator extends \Prefab
{
    protected
        //$zip,
        //$ujian,
        $zipname;

    public function generate(\Model\Ujian\Exam $ujian)
    {
        $zip = new \ZipArchive();
        $zipname = $this->tempFileGenerator(".zip");
        //$this->zip = $zip;
        $ujian->participants->orderBy('posisi asc');
        //$this->ujian = $ujian;

        \F3::set("data.ujian", $ujian);
        $zip->open($zipname, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);
        $zip->addFromString('01-mkdir.bat', \View\Bat::render("lab-mkdir.bat", "01-mkdir.log"));
        $zip->addFromString('02-copy.bat', \View\Bat::render("lab-copy.bat", "02-copy.log"));
        $zip->addFromString('03-takeown.bat', \View\Bat::render("lab-takeown.bat", "03-takeown.log"));
        $zip->addFromString('WARNING-special--takeown-full-ujian.bat', \View\Bat::render("special-ujian-fulltakeown.bat", "04-special-takeown.log"));
        $zip->close();

        return $zipname;
    }

    public function generateMigration(array $migrationLists, $exam)
    {
        $zip = new \ZipArchive();
        $zipname = $this->tempFileGenerator(".zip");
        $this->zipname = $zipname;

        \F3::set("data.migrations", $migrationLists);
        $zip->open($zipname, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);
        $zip->addFromString('00-migrate-folders.bat', \View\Bat::render("lab-migrate.bat"));

        // Limit exam lists.
        $participants = $exam->participants;
        $exam->participants = array_map(function ($d) {
            return $d['p'];
        }, $migrationLists);
        \F3::set("data.ujian", $exam);
        $zip->addFromString('01-mkdir.bat', \View\Bat::render("lab-mkdir.bat", "01-mkdir.log"));
        $zip->addFromString('02-copy.bat', \View\Bat::render("lab-copy.bat", "02-copy.log"));
        $zip->close();

        $exam->participants = $participants;
        return $zipname;
    }

    public function clean_zip()
    {
        \unlink($this->zipname);
    }

    public function tempFileGenerator($prefix = ".tmp", $length = 10, $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
    {
        $temp = "";
        while ($length-- > 0) {
            $temp .= $chars[\rand(0, \strlen($chars))];
        }
        return \F3::get('TEMP') . '/' . $temp . $prefix;
    }
}
