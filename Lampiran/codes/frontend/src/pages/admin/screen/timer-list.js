import classnames from "classnames";
import { parse } from "date-fns";
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Button, Col, Container, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, Row, Spinner, TabContent, TabPane } from 'reactstrap';
import { axios } from "~/apicall";
import ComputersContainer from '~/components/computers/computer-container';
import TimerItem from './components/TimerItem';

export class TimerList extends Component {

    state = {
        activeTab: 'seatmap',
        overtimeTarget: undefined,
        overtimeAmount: undefined
    }

    updateTimer = undefined;


    componentWillUnmount() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
    }

    componentDidMount() {
        const { adminStore } = this.props;
        console.log(adminStore._exams);
        if (adminStore.isLoading) {
            adminStore.examFetchScreenMode().then(() => {
                adminStore.armedExam.forEach(exam => {
                    if (exam?.time_left > 0) {
                        this.setState({ activeTab: "timer" });
                    }
                });
            });
            adminStore.fetchProfile();
        }

        // Setup timer.
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        this.updateTimer = setInterval(() => {
            adminStore.examFetchScreenMode(false);
        }, 10000);
    }

    handleTimerPlayClick(exam) {
        const { adminStore } = this.props;
        axios.post("manage/exam/" + exam._id + "/start").then(() => {
            adminStore.examFetchScreenMode(exam._id);
        })
    }

    handleTimerStopClick(exam) {
        const { adminStore } = this.props;
        axios.post("manage/exam/" + exam._id + "/close").then(() => {
            adminStore.examFetchScreenMode(exam._id);
        })
    }

    handleTimerResetClick(exam) {
        const { adminStore } = this.props;
        axios.delete("manage/exam/" + exam._id + "/start").then(() => {
            adminStore.examFetchScreenMode(exam._id);
        })
    }

    handleTimerOvertimeClick(exam) {
        this.setState({ overtimeTarget: exam });
    }

    handleTimerOvertimeAction(e) {
        const { adminStore } = this.props;
        e.preventDefault();
        const { overtimeAmount, overtimeTarget } = this.state;
        let sourceTime = parse(overtimeTarget.time_ended, "yyyy-MM-dd HH:mm:ss", new Date());

        // TODO: check overtimeAmount.
        sourceTime.setTime(sourceTime.getTime() + overtimeAmount * 60000);

        console.log("updated time: ", sourceTime);
        axios.put("manage/exam/" + overtimeTarget._id, {
            ...overtimeTarget,
            _id: undefined,
            answer_slot: undefined,
            participants: undefined,
            exam_report: undefined,
            lecture: undefined,
            lecture_period: undefined,
            deleted_on: undefined,
            updated_on: undefined,
            created_on: undefined,
            time_left: undefined,
            time_ended: sourceTime.getTime()/1000
        }).then(() => {
            adminStore.examFetchScreenMode(false);
            this.setState({ overtimeAmount: 0, overtimeTarget: undefined });
        })
    }


    render() {
        const { adminStore = {} } = this.props;
        const { armedExam } = adminStore;
        const { activeTab, overtimeTarget, overtimeAmount } = this.state;

        if (adminStore.isLoading) {
            return this.renderLoaderScreen();
        }

        if (adminStore.loginType !== "ip") {
            return this.renderErrorScreen("This login method doesn't support this function, please login with IPLogin to get started.", (
                <Button color="primary" tag={Link} to="/admin/account/login">Logout and Login</Button>
            ))
        }

        if (adminStore.boundedLocations?.length === 0) {
            return this.renderErrorScreen("This IP is not connected with any rooms. Please contact administrator.")
        }

        return (
            <Container>
                <Row className="h-100vh align-items-center justify-content-center text-center">
                    <Col>
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === 'seatmap' })}
                                    onClick={() => this.setState({ activeTab: 'seatmap' })}
                                >
                                    SeatMap
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === 'timer' })}
                                    onClick={() => this.setState({ activeTab: 'timer' })}
                                >
                                    Timer
                                    </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="seatmap">
                                {adminStore.boundedLocations.map((loca) => <div key={loca._id}>
                                    <h3 className="my-3 bg-success text-light">{loca?.room_name}</h3>
                                    <ComputersContainer computers={loca.computers} editable={false} />
                                </div>)}
                            </TabPane>
                            <TabPane tabId="timer">
                                {armedExam.map((waiter, i) => <TimerItem
                                    key={i}
                                    exam={waiter}
                                    onPlayClicked={() => this.handleTimerPlayClick(waiter)}
                                    onStopClicked={() => this.handleTimerStopClick(waiter)}
                                    onResetClicked={() => this.handleTimerResetClick(waiter)}
                                    onOvertimeClicked={() => this.handleTimerOvertimeClick(waiter)}
                                />)}
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>

                <Modal isOpen={!!overtimeTarget}>
                    <ModalHeader>Tambah Waktu</ModalHeader>
                    <Form onSubmit={(e) => this.handleTimerOvertimeAction(e)}>
                        <ModalBody>
                            <p>
                                Tambah waktu untuk ujian:
                            <b> {overtimeTarget?.lecture?.lecture_code} {overtimeTarget?.shift ? (" SHIFT-" + overtimeTarget?.shift) : ""}</b>
                            </p>

                            <Label>
                                Jumlah menit yang ingin ditambahkan:
                            </Label>
                            <Input name="overtimeMin" id="overtimeMin" onChange={(e) => this.setState({ overtimeAmount: e.currentTarget.value })} value={overtimeAmount} />
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={() => this.setState({ overtimeTarget: undefined })} type="button" color="secondary">Batal</Button>
                            <Button type="submit" color="warning">Tambah</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </Container>
        )
    }

    renderLoaderScreen() {
        return (<Container>
            <Row className="h-100vh align-items-center justify-content-center text-center">
                <Col>
                    <Spinner />
                    <p className="lead">Mengontak Server...</p>
                </Col>
            </Row>
        </Container>)
    }

    renderErrorScreen(message, children) {
        return (<Container>
            <Row className="h-100vh align-items-center justify-content-center text-center">
                <Col>
                    <h3>Whoops,</h3>
                    <p className="lead">{message}</p>
                    <div>{children}</div>
                </Col>
            </Row>
        </Container>)
    }
}

export default (inject("adminStore")(observer(TimerList)))
