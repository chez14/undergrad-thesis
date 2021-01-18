<?php
namespace Migration;
/**
 * Migration Example
 * Please read more documentation on https://github.com/chez14/f3-ilgar
 */
class SecurityTokenGeneration extends \Chez14\Ilgar\MigrationPacket {
    public function on_migrate(){
        $f3 = \F3::instance();
        $config_location = \realpath(__DIR__ . "/../config/");
        $securityconfig_name = "security.generated.ini";
        $privatekey_name = "pk_" . substr(hash('sha256', time()), -8);
        $publickey_name = $privatekey_name . ".pub"; 
        // making all those models
        // new private keys:
        $pkcs = new \PSX\OpenSsl\PKey([
            "digest_alg" => "sha512",
            "private_key_bits" => 4096,
            "private_key_type" => OPENSSL_KEYTYPE_RSA,
        ]);
        
        $kambing = "";
        $pkcs->export($kambing);
        \file_put_contents($config_location . "/" . $privatekey_name, $kambing);
        \file_put_contents($config_location . "/" . $publickey_name, $pkcs->getPublicKey());
        $setting_isi[]  = "[SECURITY]";
        $setting_isi[] = "privatekey_path=" . $config_location . "/" . $privatekey_name; 
        $setting_isi[] = "publickey_path=" . $config_location . "/" . $publickey_name;
    
        \file_put_contents($config_location . "/" . $securityconfig_name, \implode("\n", $setting_isi));
    }

    public function on_failed(\Exception $e) {

    }
}