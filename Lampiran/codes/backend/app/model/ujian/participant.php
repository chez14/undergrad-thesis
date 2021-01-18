<?php

namespace Model\Ujian;

class Participant extends \Model\ModelBase
{
    protected
        $fieldConf = array(
            'username' => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            'notifications' => [
                'has-many' => ["\\Model\\Ujian\\Notification", "participants", "ujian_notif_aud"],
                '_copyable' => false
            ],
            'npm' => [
                'type' => \DB\SQL\Schema::DT_TEXT,
                'nullable' => false,
                'index' => false,
                'unique' => false,
                '_copyable' => true
            ],
            'exam' => [
                'belongs-to-one' => '\Model\Ujian\Exam',
                '_copyable' => true
            ],
            'computer' => [
                'belongs-to-one' => '\Model\Ujian\Computer',
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
        $table = 'ujian_participant';

    public function __construct()
    {
        parent::__construct();

        parent::virtual('xxyyy', function ($x) {
            return substr($x->username, 1);
        });

        parent::virtual('is_upcoming', function ($x) {
            // is_upcoming is checking if the time is not ended (yet).
            // since upon timer start, time_ended filled, so we can just check
            // if it's null or not. Yesh!
            return !($x->time_ended);
        });

        parent::virtual('display_name', function ($umu) {
            if (!\F3::get('dev_setting.query_ldap'))
                return null;
            $username = $umu->username;
            $prov = \F3::get('LDAP.provider');
            $account = $prov->search()->users()->findBy('sAMAccountName', $username);
            if (!$account)
                return $username;
            return mb_convert_case($account->getFirstName() . " " . $account->getLastName(), MB_CASE_TITLE);
        });
    }

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

    /**
     * Fetch active examination with given IP. IP will be detected automatically
     * from SERVER variable.
     *
     * @param boolean $upcomingToo Should we fetch the upcoming
     * @param string $ip IP address to check on, default to autodetect.
     * @param integer $upcomingTimeMinutes How far the upcoming exam should be fetched
     * @return Participant|null Participant
     */
    public static function getActiveParticipant($upcoming = false, $ip = null, $upcomingTimeMinutes = 10)
    {
        $f3 = \Base::instance();

        if ($ip == null) {
            $ip = $f3->get('IP');
        }

        $computer = new \Model\Ujian\Computer();
        $computer->load(['ip = ?', $ip]);
        if ($computer->loaded() == 0) {
            throw new \Model\Error(
                "This computer is not registed for exam.",
                "This computer's IP ($ip) is not listed in computer that used for examination.",
                "EI01",
                "unregistered",
                403
            );
        }

        $participant = new self();
        if ($upcoming) {
            $participant->has('exam', [
                "(deleted_on = ? AND time_ended = ? AND time_opened = ?) AND (time_start <= ? AND time_start >= ?)",
                null,
                null,
                null,
                date('Y-m-d H:i:s', strtotime(("+$upcomingTimeMinutes minute"))),
                date('Y-m-d H:i:s', strtotime(("i$upcomingTimeMinutes minute"))),
            ]);
        } else {
            $participant->has('exam', [
                "(deleted_on = ? AND time_ended != ?) AND (time_opened <= ? AND time_ended >= ?)",
                null,
                null,
                date('Y-m-d H:i:s'),
                date('Y-m-d H:i:s'),
            ]);
        }

        $participant->load(['computer = ?', $computer->id], [
            "order" => "time_start asc"
        ]);

        if ($participant->loaded()) {
            return $participant;
        }

        return null;
    }

    /**
     * Get any active participant. Will return either active, upcoming, or null.
     *
     * @param string $ip IP of the computer to be queried default to autodetect.
     * @param integer $upcomingTimeMinutes How far the upcoming exam should be fetched?
     * @return Participant|null
     */
    public static function getAnyParticipant($ip = null, $upcomingTimeMinutes = 10)
    {
        $activePar = self::getActiveParticipant(false, $ip, $upcomingTimeMinutes);
        if ($activePar) {
            return $activePar;
        }

        return self::getActiveParticipant(true, $ip, $upcomingTimeMinutes);
    }
}
