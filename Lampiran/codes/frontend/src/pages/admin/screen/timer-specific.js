import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner } from 'reactstrap';
import { axios } from '~/apicall';
import TimerItem from './components/TimerItem';


export function TimerSpecLoader() {
    return (
        <Container>
            <Row className="h-100vh align-items-center justify-content-center text-center">
                <Col>
                    <Spinner />
                    <p className="lead">Mengontak Server...</p>
                </Col>
            </Row>
        </Container>
    )
}


function TimerSpecific({ match }) {
    const [exam, setExam] = useState(undefined)

    useEffect(() => {
        // load exam info
        axios.get("manage/exam/" + match.params.id).then((response) => {
            setExam(response.data.data);
        });
        return () => { }
    }, [match])

    if (!exam) {
        return (<TimerSpecLoader />)
    }

    return (
        <Container>
            <Row className="h-100vh align-items-center justify-content-center text-center">
                <Col>
                    <TimerItem exam={exam} />
                </Col>
            </Row>
        </Container>
    )
}

export default TimerSpecific
