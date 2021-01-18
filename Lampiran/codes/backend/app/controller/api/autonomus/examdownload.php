<?php

namespace Controller\Api\Autonomus;

use DateInterval;
use DateTimeImmutable;
use Helper\AnswerZipper;
use InvalidArgumentException;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Key;
use Lcobucci\JWT\Signer\Keychain;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\ValidationData;
use Model\Error as ModelError;
use Model\Ujian\ExamReport;
use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Validator as v;
use View\Api;

class ExamDownload extends \Prefab
{

    public function beforeroute($f3)
    {
        \Helper\PreAPI::doTheThing();
    }

    function __construct()
    {
        v::with("\\Helper\\Rules");
    }

    /**
     * See info and generate download token for current exam.
     *
     * @param \Base $f3
     * @return void
     */
    function post_index(\Base $f3)
    {
        try {
            $validator = v::key("token", v::notOptional()->mustExists("\\Model\\Ujian\\ExamReport", 'token'));
            $validator->assert($f3->POST);
            // TODO: Limit with Google Auth Token (reconsult)

            $reportExam = new ExamReport();
            $reportExam->load(["token=? and valid_until>=?", $f3->POST['token'], date('Y-m-d H:i:s')]);

            if ($reportExam->loaded() === 0) {
                throw new InvalidArgumentException("Token no longger valid.");
            }

            $exam = $reportExam->exam;

            $logger = $exam->getLoggerInstance();
            $logger->warn("Autoreport link from " . $reportExam->_id . "is being accessed via " . $f3->IP);

            // generate JWT Token
            $issued = new DateTimeImmutable();
            $expiration = $issued->add(DateInterval::createFromDateString(\Base::instance()->get('SECURITY.expiration') . " seconds"));
            $signer = new Sha256();
            $keychain = new Key("file://" . \Base::instance()->get('SECURITY.privatekey_path'));
            $token = (new Builder())->issuedBy(\Base::instance()->get('SECURITY.issuer'))
                ->issuedAt($issued)
                ->expiresAt($expiration)
                ->withClaim('uid', $reportExam->_id)
                ->getToken($signer,  $keychain);

            $link = [$f3->get("BASE_URL_PUBLIC"), "api", "v1", "autonomus", "examdownload", "download"];
            $link = implode("/", array_map(function ($parts) {
                return trim($parts, "/\\");
            }, $link));
            $link .= "?token=$token";

            return Api::success([
                "exam" => $exam->cast(),
                "downloadToken" => $link
            ]);
        } catch (NestedValidationException $e) {
            throw \Helper\Ruler::transformToError($e);
        } catch (InvalidArgumentException $e) {
            throw new ModelError("Invalid Input", $e->getMessage(), "X400", "Exception", 400);
        }
    }

    /**
     * Zip and download the answer file for generated exam.
     *
     * @param \Base $f3
     * @return void
     */
    function get_download(\Base $f3)
    {
        try {
            $validator = v::key("token", v::notOptional());
            $validator->assert($f3->GET);
        } catch (NestedValidationException $e) {
            throw \Helper\Ruler::transformToError($e);
        }

        $token = (new Parser())->parse($f3->GET['token']);
        // die(var_dump($token));

        $data = new ValidationData(); // It will use the current time to validate (iat, nbf and exp)
        $data->setIssuer(\Base::instance()->get('SECURITY.issuer'));


        $signer = new Sha256();
        $keychain = new Keychain();

        if (!$token->validate($data) || !$token->verify(
            $signer,
            $keychain->getPublicKey("file://" . \Base::instance()->get('SECURITY.publickey_path'))
        )) {
            throw new ModelError("Bad Token", "The given token is invalid, expired, or Report Token no longer exists.", 403, "Bad Token", 403);
        }

        // Token has been validated. Will now continue zip the answer and serve
        // them as is.
        $examReport = new ExamReport();
        $examReport->load(["id=?", $token->getClaim('uid')]);
        if (!$examReport->loaded()) {
            throw new ModelError("Bad Token", "The given token is invalid, expired, or Report Token no longer exists.", 403, "Bad Token", 403);
        }

        $logger = $examReport->exam->getLoggerInstance();
        $logger->warn("Exam answer is being downloaded via ExamReport#" . $examReport->_id . " via " . $f3->IP);

        $zipname = AnswerZipper::zipExam($examReport->exam);
        $filename = AnswerZipper::getProperFilename($examReport->exam);

        $logger->info("Answer filename is " . $filename);

        $filename .= ".zip";

        header("X-Filename: $filename");
        \Web::instance()->send(
            $zipname,
            null,
            0,
            true,
            $filename
        );
        if (is_file($zipname)) {
            unlink($zipname);
        }
    }
}
