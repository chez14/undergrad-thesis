import { inject, observer } from "mobx-react"
import React, { Component } from 'react'
import { Else, If, Then } from 'react-if'
import Card from "reactstrap/lib/Card"
import CardBody from "reactstrap/lib/CardBody"
import Col from "reactstrap/lib/Col"
import Container from "reactstrap/lib/Container"
import Row from "reactstrap/lib/Row"
import Buildinfo from '~/components/buildinfo/Buildinfo'
import ExamNav from '~/components/exam/navbar/Navbar'
import NoExam from './NoExam'
import NotifModal from './NotifModal'
import Submitter from './Submitter'
import Upcoming from './Upcoming'



class Index extends Component {
  state = {
    notification: undefined
  }

  render() {
    const { examStore } = this.props;
    const { exam, participant = {} } = examStore;

    const { notification } = this.state;

    let ExamHandler = (!exam?.time_opened) ? Upcoming : Submitter;

    // update document title
    if (!exam) {
      document.title = "Tidak ada ujian berlangsung."
    } else {
      document.title = [participant.username, "-", exam.lecture?.lecture_code, "Ujian"].join(" ");
    }

    return (
      <>
        <NotifModal notification={notification} onCloseRequested={() => this.setState({ notification: undefined })} />
        <div className="bg-light">
          <Container>
            <Row className="h-100vh align-items-center justify-content-center">
              <Col md={8}>
                <Card className="overflow-hidden">

                  <If condition={!exam}>
                    <Then>
                      <NoExam />
                    </Then>
                    <Else>
                      <ExamNav type={!exam?.time_opened ? "upcoming" : "inprogress"} participant={participant} onNotifShowRequested={(e) => this.setState({ notification: e })} />
                      <CardBody>
                        <ExamHandler participant={participant} />
                      </CardBody>
                    </Else>
                  </If>

                </Card>
                <p className="text-center text-secondary">
                  <small><Buildinfo /></small>
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    )
  }
}

export default inject('examStore')(observer(Index));