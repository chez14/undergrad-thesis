<?php

namespace Migration;

/**
 * Migration Example
 * Please read more documentation on https://github.com/chez14/f3-ilgar
 */
class RefreshNotification extends \Chez14\Ilgar\MigrationPacket
{
    public function on_migrate()
    {
        $f3 = \F3::instance();
        \Model\Ujian\Notification::setup();
    }

    public function on_failed(\Exception $e)
    {
    }
}