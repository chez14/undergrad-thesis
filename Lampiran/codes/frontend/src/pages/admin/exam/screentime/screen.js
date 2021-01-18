import { faHistory, faStop, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { Else, If, Then } from 'react-if';
import { useRouteMatch } from 'react-router-dom';
import { Badge, Button, Col, Container, Row } from 'reactstrap';
import { axios } from '~/apicall';
import { useAdminStore } from '~/components/use-store';

function ScreenTime() {
    const match = useRouteMatch("/admin/exam/:id/screen");
    const adminStore = useAdminStore();
    // eslint-disable-next-line
    const [waitRefreshTime, setWaitRefreshTime] = useState(120)
    useEffect(() => {
        if (adminStore.selectedExam !== match.params.id) {
            adminStore.selectedExam = match.params.id;
            adminStore.examFetch(match.params.id);
        }

        let timer = setInterval(() => {
            adminStore.examFetch(match.params.id);
        }, waitRefreshTime * 1000);

        return () => {
            clearInterval(timer);
        };
    }, [adminStore, match.params.id, waitRefreshTime]);

    // useEffect(() => {
    //     if (adminStore.exam.time_left < 300 && waitRefreshTime !== 30) {
    //         setWaitRefreshTime(30);
    //     } else if (adminStore.exam.time_left === 0 || adminStore.exam.time_left === null) {
    //         setWaitRefreshTime(120);
    //     }
    //     return () => { };
    // }, [adminStore, waitRefreshTime])

    function handleStart() {
        axios.post("manage/exam/" + match.params.id + "/start").then(() => {
            adminStore.examFetch(match.params.id);
        })
    }

    function handleStop() {
        axios.post("manage/exam/" + match.params.id + "/close").then(() => {
            adminStore.examFetch(match.params.id);
        })
    }

    function handleReset() {
        axios.delete("manage/exam/" + match.params.id + "/start").then(() => {
            adminStore.examFetch(match.params.id);
        })
    }

    const { exam } = adminStore;
    return (
        <div>
            <Container>
                <Row style={{ minHeight: "calc(100vh - 64px)" }} className="align-items-center">
                    <Col>
                        <div>
                            <div className="d-flex align-items-center">
                                <h4 className="display-4 flex-grow-1">
                                    <Badge color={exam.uts ? "info" : "success"}>{exam.uts ? "UTS" : "UAS"}</Badge>{' '}
                                    {exam.lecture.lecture_code}{(exam.shift !== null && exam.shift !== 0) ? " SHIFT-" + exam.shift : ""}
                                </h4>
                                <h4 className="font-weight-bold">
                                    {exam.time_duration / 60} Menit
                                </h4>
                            </div>
                            <h1 className="display-3">{exam.lecture.name}</h1>
                        </div>
                        <div>
                            <If condition={!!exam.time_opened && exam.time_left >= 1}>
                                <Then>
                                    <p className="display-1 text-center font-weight-bold my-2 py-3" style={{ fontSize: "10rem" }}>
                                        <Countdown date={Date.now() + exam.time_left * 1000} onComplete={() => adminStore.examFetch(match.params.id)} autoStart={!!exam.time_opened} />
                                    </p>
                                </Then>
                                <Else>
                                    <If condition={exam.time_left >= 1}>
                                        <Then>
                                            <p className="display-2 font-weight-bold text-center bg-primary text-light my-2 py-3">READY</p>
                                        </Then>
                                        <Else>
                                            <p className="display-2 font-weight-bold text-center bg-dark text-light my-2 py-3">FINISH</p>
                                        </Else>
                                    </If>
                                </Else>
                            </If>
                        </div>
                        <div className="mt-5">
                            <p>Control</p>
                            <div>
                                <If condition={!exam.time_opened}>
                                    <Then>
                                        <Button className="mr-2" color="primary" onClick={handleStart}><FontAwesomeIcon icon={faStopwatch} /> Start Timer</Button>
                                        <p className="mt-3">
                                            Untuk memulai dan membuka tempat pengumpulan, anda dapat menekan <b>Start Timer</b>.
                                        </p>
                                    </Then>
                                    <Else>
                                        <If condition={exam.time_left === 0}>
                                            <Then>
                                                <Button className="mr-2" color="danger" onClick={handleReset}><FontAwesomeIcon icon={faHistory} /> Reset Timer</Button>
                                            </Then>
                                            <Else>
                                                <Button className="mr-2" color="warning" onClick={handleStop}><FontAwesomeIcon icon={faStop} /> Stop Timer</Button>
                                                <Button className="mr-2" color="danger" onClick={handleReset}><FontAwesomeIcon icon={faHistory} /> Reset Timer</Button>
                                                <p className="mt-3">
                                                    <b>Penting:</b> Dengan menutup/mereset timer, anda akan menutup tempat pengumpulan peserta ujian.
                                                </p>
                                            </Else>
                                        </If>
                                    </Else>
                                </If>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default observer(ScreenTime)
