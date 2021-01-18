import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Route, Switch, withRouter } from "react-router-dom";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Spinner from "reactstrap/lib/Spinner";
import ExamIndex from './index/Index';


export class Exam extends Component {

  refreshTime = 120;
  refreshTimer = undefined;

  componentWillUnmount() {
    clearInterval(this.refreshTimer)
  }

  async componentDidMount() {
    const { examStore } = this.props;

    // Forcing the examination to be fetched first before continuing to arm the
    // refresh timer.
    if (examStore.isFetchingExam) {
      await examStore.fetchExamInfo()
    }

    let refreshTime = this.determineRefreshTime(examStore)
    this.armRefreshTimer(examStore, refreshTime);
  }

  armRefreshTimer(examStore, refreshTime) {
    console.info("determining next tick will be ", refreshTime);
    this.refreshTimer = setInterval(async () => {
      await examStore.fetchExamInfo(false);

      // Check refresh time change. If it DOES change, clear the interval and
      // set a new one.
      // this might be buggy tough. Not reccomended, but its currenly the only
      // solution that works.
      let detectRefreshTimeChange = this.determineRefreshTime(examStore);


      if (refreshTime !== detectRefreshTimeChange) {
        clearInterval(this.refreshTimer);
        this.armRefreshTimer(examStore, detectRefreshTimeChange);
      }
    }, refreshTime * 1000)
  }

  determineRefreshTime(examStore) {
    // For upcoming exam, we'll update every 10 seconds.
    if (examStore.participant?.is_upcoming) {
      return 10;
    }

    // for current active exam, we'll update every 30 seconds
    if (examStore.exam?.time_left <= 120) {
      return 30;
    }

    // By default, refresh for every 2 minutes
    return 120;
  }

  render() {
    const { examStore, match } = this.props;

    //show loader when exam is loading or in fetching situation.
    if (examStore.isFetchingExam) {
      document.title = "Memuat info ujian...";
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


    return (
      <Switch>
        <Route exact path={match.path} component={ExamIndex} />
      </Switch>
    )
  }
}

export default withRouter(inject("examStore")(observer(Exam)))
