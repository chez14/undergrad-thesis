import React, { useEffect } from 'react';
import Spinner from "reactstrap/lib/Spinner";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";

import { observer } from 'mobx-react';
import { useHistory } from "react-router-dom";
import useStores from '~/components/use-store';

function Index() {
  const history = useHistory();
  const { examStore } = useStores();

  useEffect(() => {
    examStore.fetchExamInfo().then(() => {
      history.replace('/exam');
    }).catch((e) => {
      history.replace('/admin');
    });

    return () => { };
  }, [history, examStore])
  return (
    <div className="bg-light">
      <Container>
        <Row className="h-100vh align-items-center">
          <Col className="text-center">
            <Spinner />
            <p className="lead">Sedang menghubungi server...</p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default observer(Index);