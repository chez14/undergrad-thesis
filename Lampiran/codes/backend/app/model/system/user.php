<?php

namespace Model\System;

use DateInterval;
use DateTimeImmutable;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Key;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Signer\Keychain;
use Lcobucci\JWT\Signer\Rsa\Sha256;

class User extends \Model\ModelBase
{
    protected
        $fieldConf = array(
            "username" => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                '_copyable' => true
            ],
            "password" => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => true,
                '_copyable' => true
            ],
            "email" => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                '_copyable' => true
            ],
            "acl" => [
                'belongs-to-one' => '\Model\System\Acl',
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
        $table = 'system_user';

    public const
        E_GENERIC = "Kombinasi User dan Password tidak ditemukan, coba lagi",
        E_LOGIN_NOT_SUPPORTED = "Login untuk tipe user ini saat ini belum di support.";



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

    public static function getFromSession($statusOnly = false)
    {
        $f3 = \Base::instance();
        if (!$f3->exists('SESSION.user'))
            return null;

        if ($statusOnly) {
            return "user";
        }

        $user = new self;
        $user->load(['id = ?', $f3->get('SESSION.user')]);
        return $user;
    }

    public static function getFromHTTPHeader()
    {
        if (!\Base::instance()->exists('HEADERS.Authorization')) {
            return false;
        }
        $auth_header = \Base::instance()->get('HEADERS.Authorization');
        $auth_header = \substr($auth_header, strlen("Bearer "));
        $token = (new Parser())->parse($auth_header);

        $data = new ValidationData(); // It will use the current time to validate (iat, nbf and exp)
        $data->setIssuer(\Base::instance()->get('SECURITY.issuer'));


        $signer = new Sha256();
        $keychain = new Keychain();

        if (!$token->validate($data) || !$token->verify(
            $signer,
            $keychain->getPublicKey("file://" . \Base::instance()->get('SECURITY.publickey_path'))
        )) {
            return false;
        }

        $user = new self();
        $user->load(['id=?', $token->getClaim('uid')]);
        if ($user->dry()) {
            return false;
        }
        return $user;
    }

    public static function getIPLoginHTTPHeader()
    {
        if (!\Base::instance()->exists('HEADERS.Authorization')) {
            return null;
        }
        $auth_header = \Base::instance()->get('HEADERS.Authorization');
        $auth_header = \substr($auth_header, strlen("Bearer "));
        $token = (new Parser())->parse($auth_header);

        $data = new ValidationData(); // It will use the current time to validate (iat, nbf and exp)
        $data->setIssuer(\Base::instance()->get('SECURITY.issuer'));

        $signer = new Sha256();
        $keychain = new Keychain();

        if (!$token->validate($data) || empty($token->getClaim('iplid')) || !$token->verify(
            $signer,
            $keychain->getPublicKey("file://" . \Base::instance()->get('SECURITY.publickey_path'))
        )) {
            return null;
        }

        $iplogin = new IPLogin();
        $iplogin->load(['user=? and id=?', $token->getClaim('uid'), $token->getClaim('iplid')]);
        if ($iplogin->dry()) {
            return null;
        }
        return $iplogin;
    }

    public function generateToken($as = "basic", $iploginId = null)
    {
        if ($this->dry()) {
            throw new \Exception('Model is dry!');
        }
        $issued = new DateTimeImmutable();
        $expiration = $issued->add(new DateInterval("PT" . \Base::instance()->get('SECURITY.expiration') . "S"));
        $signer = new Sha256();
        $keychain = new Key("file://" . \Base::instance()->get('SECURITY.privatekey_path'));
        $token = (new Builder())->issuedBy(\Base::instance()->get('SECURITY.issuer'))
            ->issuedAt($issued)
            ->expiresAt($expiration)
            ->withClaim('uid', $this->_id)
            ->withClaim('uid-as', $as)
            ->withClaim('iplid', $iploginId)
            ->getToken($signer,  $keychain);
        return $token;
    }

    public static function login($username, $password, $set_session = false)
    {
        $user = new self;
        $user->load(['username=? or email=?', $username, $username]);
        if (!$user->loaded())
            throw new \Exception(self::E_GENERIC);

        if ($user->password == null) {
            throw new \Exception(self::E_LOGIN_NOT_SUPPORTED);
        }

        if (!$user->auth($password))
            throw new \Exception(self::E_GENERIC);

        $f3 = \Base::instance();

        if ($set_session) {
            $f3->set('SESSION.user', $user->id);
        }
        return $user;
    }

    public function auth($password)
    {
        return password_verify($password, $this->password);
    }


    public function set_password($pass)
    {
        return ($pass === null) ? $pass : password_hash($pass, CRYPT_BLOWFISH);
    }

    public function cast($obj = NULL, $rel_depths = 1, $save_cast = true)
    {
        $obj = parent::cast($obj, $rel_depths);
        if (!$save_cast) {
            return $obj;
        } else {
            unset($obj['password']);
            return $obj;
        }
    }
}
