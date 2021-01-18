import React from 'react';

import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Spinner from "reactstrap/lib/Spinner";

const Nologin = () => {
  return (
    <div className="bg-light">
        <Container>
          <Row className="h-100vh align-items-center">
            <Col className="text-center">
              <Spinner/>
              <p className="lead">Sedang menghubungi server...</p>
            </Col>
          </Row>
        </Container>
      </div>
  )
}

export default Nologin;