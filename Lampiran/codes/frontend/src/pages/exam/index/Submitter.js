import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import Countdown from 'react-countdown';
import { When } from 'react-if';
import { Badge } from 'reactstrap';
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import Table from "reactstrap/lib/Table";
import { useExamStore } from '~/components/use-store';
import Lotter from './submit/lotter';



function Submitter({ participant = {} }) {
  const { exam = {} } = participant;

  const examStore = useExamStore();
  return (
    <>
      <Row className="align-items-baseline">
        <Col xs={{ size: 4, order: 2 }}>
          <p className="lead m-0 text-right"><Countdown date={Date.now() + exam.time_left * 1000} onComplete={() => examStore.fetchExamInfo(false)} /></p>
          <p className="m-0 text-right">{participant.computer?.name}@{participant.computer?.location?.room_name}</p>
        </Col>
        <Col xs={{ size: 8, order: 1 }}>
          <h4>{exam.uts ? "UTS" : "UAS"} {exam.lecture?.lecture_code}
            <When condition={exam.shift !== 0}>
              {' '}<Badge color={exam.uts ? "info" : "success"}>S-{exam.shift}</Badge>
            </When>
          </h4>
          <p>{exam.lecture?.name}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h5>Pengumpulan:</h5>
          <Table striped>
            <tbody>
              {exam.answer_slot?.map((ans, i) => <Lotter answer_slot={ans} exam={exam} key={i} />)}
            </tbody>
          </Table>
        </Col>
      </Row>

    </>
  )
}
Submitter.propTypes = {
  participant: PropTypes.object.isRequired
}

export default (observer(Submitter));