<?php
    chdir(dirname(__DIR__));
    // Config Loader
    \F3::instance()->config("app/config/config.ini");

    //connect to SQL Database.
    \F3::set('SYSTEM.DB', false);
    if(F3::instance()->exists('database')) {
        try {
            \F3::set('DB', new \DB\SQL(F3::get('database.dsn'),
                F3::get('database.username'),
                F3::get('database.password'), [
                    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                    \PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
                ])
            );
            \F3::set('SYSTEM.DB', true);
        } catch (PDOException $e){
            \F3::set('DB', null);
        }
    }

    \Chez14\Ilgar\Boot::now();

    // some constants
    \F3::set('CZ_PUBLIC_HTML', realpath(__DIR__ . "../public_html/"));

    //LDAP Connect
    if(\F3::get('dev_setting.query_ldap')) {
        $ad = new \Adldap\Adldap();
        $ad->addProvider(new \Adldap\Connections\Provider(\F3::get('ldap_provider')));
        
        \F3::set('LDAP.base', $ad);
        try {   
            \F3::set('LDAP.provider', $ad->connect());
        } catch (\Exception $e) {
            \F3::set('LDAP.provider', null);
            \F3::set('dev_setting.query_ldap', false);
        }
    }