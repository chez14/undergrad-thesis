import React, { useState, useEffect } from 'react'
import { Row, Col, Input, InputGroup } from 'reactstrap'
import { DayPickerSingleDateController } from "react-dates";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './datepicker-override.scss';
import moment from "moment";
import { When } from 'react-if';
import TimeKeeper from 'react-timekeeper';

function DateTimePicker({ defaultValue = new Date(), onChange = () => null, disabled = false }) {
    const [selectedDate, setSelectedDate] = useState(moment(defaultValue))
    const [dpOpen, setDpOpen] = useState(false);
    const [tpOpen, setTpOpen] = useState(false);

    function handleDateChange(day) {
        setSelectedDate(day);
        setDpOpen(false);
    }

    function handleTimeChange(time) {
        let m = moment(selectedDate);
        m.hour(time.hour);
        m.minutes(time.minute);
        setSelectedDate(m);
        setTpOpen(false);
    }

    useEffect(() => {
        onChange(selectedDate);
        return () => { };
    }, [selectedDate, onChange])

    return (
        <Row>
            <Col>
                <InputGroup>
                    <Input className="bg-white" type="text" disabled={disabled} value={selectedDate.format("YYYY-MM-DD")} onClick={() => { setDpOpen(true); setTpOpen(false) }} onChange={() => null} />
                    <Input className="bg-white" type="text" disabled={disabled} readOnly value={selectedDate.format("HH:mm")} onClick={() => { setTpOpen(true); setDpOpen(false) }} onChange={() => null} />
                </InputGroup>
                <When condition={dpOpen}>
                    <DayPickerSingleDateController
                        date={selectedDate}
                        numberOfMonths={2}
                        onDateChange={handleDateChange}
                        onOutsideClick={() => setDpOpen(false)} />
                </When>
                <When condition={tpOpen}>
                    <TimeKeeper hour24Mode
                        time={selectedDate.format("HH:mm")}
                        onDoneClick={handleTimeChange}
                        switchToMinuteOnHourSelect
                        closeOnMinuteSelect />
                </When>
            </Col>
        </Row>
    )
}

export default DateTimePicker
