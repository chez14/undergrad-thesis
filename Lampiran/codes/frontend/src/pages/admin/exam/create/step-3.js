import React, { useState } from 'react'
import { Row, Col, Button, Badge, Alert } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWalking } from '@fortawesome/free-solid-svg-icons'

import moment from "moment";
import "moment/locale/id";
import { axios } from '~/apicall';
import { If, Then, Else, When } from 'react-if';

moment.locale('id');

function Step3({ examDetails, onRequestNext }) {

    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("")
    const [errorMsg, setErrorMsg] = useState(null)

    function handleCreation() {
        setIsLoading(true)
        setStatus("Spinning up new exam...")
        axios.post("manage/exam", {
            lecture: examDetails.lecture,
            uts: examDetails.uts,
            time_duration: examDetails.duration,
            shift: examDetails.shift,
            time_start: examDetails.timeStart
        }).then((response) => {
            setStatus("Populating area...");
            return axios.post("/manage/exam/" + response.data.data._id + "/populate", {
                computers: examDetails.computers,
                participants: examDetails.peserta,
            }).then(promi => {
                return Promise.resolve({ exam: response, populate: promi });
            }).catch((resp) => {
                setStatus("Error happened, reverting things...");
                return axios.delete("manage/exam/" + response.data.data._id).then(() => {
                    Promise.reject(resp);
                })
            });
        }).then((response) => {
            onRequestNext(response.exam.data.data);
        }).catch((resp) => {
            setIsLoading(false);

            if (resp.response.data && resp.response.data.error) {
                setErrorMsg(<>
                    <h5>{resp.response.data.error.title} [{resp.response.data.error.error_code}]</h5>
                    <p>{resp.response.data.error.description}</p>
                </>)
            } else {
                console.error(resp);
                console.log(JSON.stringify(resp));
                setErrorMsg(<>
                    <h5>Error happened</h5>
                    <p>{resp.message}</p>
                    <p><small>Because it's a browser(/network) related error, the error has been emitted to the console.</small></p>
                </>)
            }
        });
    }

    return (
        <div className="my-4">
            <h3>Konfirmasi</h3>
            <Row>
                <Col>
                    <p className="h2">
                        <Badge color={examDetails.uts ? "info" : "success"}>{examDetails.uts ? "UTS" : "UAS"}</Badge>
                        <span className="ml-3">{(examDetails.lecture_obj || {}).name || "Nama Matakuliah di sini"}</span>
                    </p>
                    <p className="lead">{examDetails.shift ? "Shift " + examDetails.shift : "Tanpa Shift"} - {(examDetails.peserta || []).length} Peserta</p>
                    <p>Dilaksanakan pada ruang (ruangan). Akan dimulai pada <b>{moment(examDetails.timeStart).format('LLLL')}</b> selama <b>{examDetails.duration / 3600} jam</b>.</p>
                    <When condition={!!errorMsg}>
                        <Alert color="danger">{errorMsg}</Alert>
                    </When>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="text-center my-5 pt-5">
                        <p>Untuk konfirmasi pembuatan ujian, tekan tombol di bawah ini.</p>
                        <Button color="warning" size="lg" onClick={handleCreation} disabled={isLoading}>
                            <If condition={isLoading}>
                                <Then>{status}</Then>
                                <Else>Create Exam <FontAwesomeIcon icon={faWalking} /></Else>
                            </If>
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Step3
