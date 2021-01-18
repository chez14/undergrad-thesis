<?php

use Model\System\User;
use Model\System\Acl;
use PHPUnit\Framework\TestCase;

class AuthenticationTest extends TestCase
{

    /**
     * User used during the testing periode
     *
     * @var \Model\System\User
     */
    protected $user = null;

    /**
     * Create new user during the test.
     *
     * @return void
     */
    protected function setUp(): void
    {
        // test if user able to do login
        $acl = new Acl();
        $acl->load(["id=?", 1]);
        $user = new User();
        $user->copyfrom([
            "username" => "testsuite",
            "password" => "testsuite",
            "email" => "testsuite@testingground.labftis.net",
            "acl" => $acl
        ]);
        $user->save();

        $this->user = $user;
    }

    /**
     * Remove the testser
     *
     * @return void
     */
    protected function tearDown(): void
    {
        $this->user->erase();
    }

    public function testLoginShouldFailOnWrongPassword()
    {
        // login test:
        $this->expectException(Exception::class);
        $user = User::login("testsuite", "defenitely-wrong-password");
    }

    public function testLoginShouldFailOnWrongUsername()
    {
        // login test:
        $this->expectException(Exception::class);
        $user = User::login("unknown-username", "testsuite");
    }
    
    public function testLoginShouldBeOkOnCorrectCredential() {
        $user = User::login("testsuite", "testsuite");
        $this->assertNotNull($user);
    }
}
