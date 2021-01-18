<?php

namespace Migration;

/**
 * Migration Example
 * Please read more documentation on https://github.com/chez14/f3-ilgar
 */
class DisableSystemUserLogin extends \Chez14\Ilgar\MigrationPacket
{
    public function on_migrate()
    {
        $systemuser = new \Model\System\User();
        $systemuser->load(["username = ?", "system_capybara"]);
        $systemuser->password = null;
        $systemuser->save();
    }

    public function on_failed(\Exception $e)
    { }
}
