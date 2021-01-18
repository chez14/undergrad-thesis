import { faHistory, faStop, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Else, If, Then, When } from 'react-if';
import { Badge, Button, ButtonGroup, Col, Container, Row, Table } from 'reactstrap';
import { axios } from '~/apicall';
import CountDown from '~/components/countdown/countdown';
import { useAdminStore } from '~/components/use-store';


function MinipanelControlButton({ handleStart, handleStop, handleReset, exam }) {
    return (<ButtonGroup className="btn-block">
        <If condition={exam.time_left === null}>
            <Then>
                <Button className="mr-2" color="primary" onClick={handleStart}><FontAwesomeIcon icon={faStopwatch} /> Start</Button>
            </Then>
            <Else>
                <When condition={exam.time_left !== 0}>
                    <Button className="mr-2" color="warning" onClick={handleStop}><FontAwesomeIcon icon={faStop} /> Stop</Button>
                </When>
                <Button className="mr-2" color="danger" onClick={handleReset}><FontAwesomeIcon icon={faHistory} /> Reset</Button>
            </Else>
        </If>
    </ButtonGroup>);
}

function LoaderComponent() {
    return <Container className="text-center">
        <h3>Loading...</h3>
    </Container>
}


function ExamMinipanel({ match }) {
    const adminStore = useAdminStore();
    const { exam } = adminStore;


    useEffect(() => {
        adminStore.selectedExam = match.params.id;
        adminStore.examFetch(match.params.id);
        return () => {
        };
    }, [adminStore, match])

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

    if (adminStore.isLoading) {
        return <LoaderComponent />
    }

    return (
        <Container>
            <Row className="mt-4 justify-content-center">
                <Col xs={12} md={5}>
                    <h4 className="text-center">Minipanel - {exam.lecture.lecture_code} <When condition={exam.shift !== 0}><br /><Badge color="dark">SHIFT-{exam.shift}</Badge></When></h4>

                    <section className="my-5">
                        <div className="h2 text-center">
                            <CountDown secondsLeft={toJS(exam.time_left)} />
                        </div>
                        <MinipanelControlButton handleReset={handleReset} handleStart={handleStart} handleStop={handleStop} exam={exam} />
                    </section>

                    <Table>
                        <tbody>
                            <tr>
                                <th>Mata Kuliah</th>
                                <td>{exam.lecture.name} ({exam.lecture.lecture_code})</td>
                            </tr>
                            <tr>
                                <th>Tahun Ajaran</th>
                                <td>{exam.lecture_period.period_code}</td>
                            </tr>
                            <tr>
                                <th>Mulai - Berakhir</th>
                                <td>{exam.time_opened} - {exam.time_ended}</td>
                            </tr>
                            <tr>
                                <th>Waktu Mulai Pengumpulan</th>
                                <td>{exam.time_start || "Belum di buka"}</td>
                            </tr>
                            <tr>
                                <th>Durasi</th>
                                <td>{exam.time_duration / 60} Menit</td>
                            </tr>
                            <tr>
                                <th>Uts/Uas</th>
                                <td>{exam.uts ? "UTS" : "UAS"}</td>
                            </tr>
                            <tr>
                                <th>Jumlah Peserta</th>
                                <td>{(exam.participants || []).length} Orang</td>
                            </tr>
                            <tr>
                                <th>Dibuat pada</th>
                                <td>{exam.created_on}</td>
                            </tr>
                            <tr>
                                <th>Terakhir diperbaharui</th>
                                <td>{exam.updated_on}</td>
                            </tr>
                        </tbody>
                    </Table>

                    <section className="my-4">
                        <MinipanelControlButton handleReset={handleReset} handleStart={handleStart} handleStop={handleStop} exam={exam} />
                    </section>
                </Col>
            </Row>
        </Container>
    )
}

export default observer(ExamMinipanel)
