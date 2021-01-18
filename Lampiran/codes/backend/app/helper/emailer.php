<?php

namespace Helper;

use PHPMailer\PHPMailer\PHPMailer;

class Emailer extends \Prefab
{
    /**
     * Constructs fully configured PHPMailer instance, ready to use.
     *
     * @return PHPMailer
     */
    public static function getEmailInstance(): PHPMailer
    {

        $mailer = new PHPMailer(true);
        $mailer->isSMTP();

        $f3 = \Base::instance();
        // setting up credential
        $mailer->Host = $f3->get("SMTP.host");
        $mailer->SMTPAuth = true;
        $mailer->Username = $f3->get("SMTP.username");
        $mailer->Password = $f3->get("SMTP.password");
        $mailer->Port = intval($f3->get("SMTP.port"));

        if ($f3->exists("SMTP.from")) {
            $mailer->From = $f3->get("SMTP.from");
        }
        if ($f3->exists("SMTP.replyto")) {
            $mailer->addReplyTo($f3->get("SMTP.replyto"));
        }

        return $mailer;
    }
}
