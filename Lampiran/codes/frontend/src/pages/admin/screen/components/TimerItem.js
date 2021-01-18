import { faCalendarPlus, faHistory, faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Countdown from 'react-countdown'
import { Badge, Button, ButtonGroup, Card, CardBody, CardHeader, UncontrolledTooltip } from 'reactstrap'

export class TimerItem extends Component {
    static propTypes = {
        multipleMode: PropTypes.bool,
        exam: PropTypes.object.isRequired,
        onPlayClicked: PropTypes.func,
        onStopClicked: PropTypes.func,
        onResetClicked: PropTypes.func,
        onOvertimeClicked: PropTypes.func,
    }

    props = {
        multipleMode: false,
        onPlayClicked: () => { },
        onStopClicked: () => { },
        onResetClicked: () => { },
        onOvertimeClicked: () => { },
    }


    render() {
        const { exam, onPlayClicked, onStopClicked, onResetClicked, onOvertimeClicked } = this.props;
        let lectureCode = (<b>{exam?.lecture?.lecture_code}</b>);
        if (exam?.shift) {
            lectureCode = <>{lectureCode} &nbsp; SHIFT-{exam.shift}</>;
        }

        return (
            <Card>
                <CardHeader className={"h4 text-light bg-" + (exam?.uts ? "info" : "success")}>
                    <div className="d-flex">
                        <div className="d-flex flex-grow-1">
                            <Badge color="light">{exam?.uts ? "UTS" : "UAS"}</Badge> &nbsp; {lectureCode}
                        </div>
                        <div className="d-flex font-weight-bold">
                            {/* TODO: Standarisasi ke detik */}
                            {exam.time_duration / 60} Menit
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <h2 className="display-4 text-center">{exam.lecture?.name}</h2>
                    <div className="display-2 font-weight-bold text-center d-flex align-items-center justify-content-center">
                        <Countdown date={Date.now() + (exam.time_left * 1000)} className="d-flex mx-3" autoStart={!!exam.time_opened} />
                        <Button color="warning" id={"overtimeBtn-" + exam._id} onClick={(event) => onOvertimeClicked(event, exam)}><FontAwesomeIcon icon={faCalendarPlus} className="d-flex" /></Button>
                        <UncontrolledTooltip placement="right" target={"overtimeBtn-" + exam._id}>Tambah Overtime/Waktu</UncontrolledTooltip>
                    </div>
                    <div className="mt-4">
                        <div>
                            <ButtonGroup className="mx-3 my-2">
                                <Button onClick={(event) => onPlayClicked(event, exam)} color="success" disabled={!!exam?.time_opened}>
                                    <FontAwesomeIcon icon={faPlay} />
                                </Button>
                                <Button onClick={(event) => onStopClicked(event, exam)} color="danger" disabled={!exam?.time_opened}>
                                    <FontAwesomeIcon icon={faStop} />
                                </Button>
                                <Button onClick={(event) => onResetClicked(event, exam)} color="secondary" disabled={!exam?.time_opened}>
                                    <FontAwesomeIcon icon={faHistory} />
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </CardBody>
            </Card>
        )
    }
}

export default TimerItem
