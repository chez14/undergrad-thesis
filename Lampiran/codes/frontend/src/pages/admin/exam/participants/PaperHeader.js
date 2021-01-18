import React from 'react';

import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";

import UnparLogo from "~/assets/unpar-wb-01.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function PaperHeader({ backLink }) {
  return (<>
    <header className="my-5 d-none d-print-block">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col xs={1}>
            <div className="text-right">
              <img src={UnparLogo} alt="unpar-logo" style={{ height: "4rem", width: "auto" }} />
            </div>
          </Col>
          <Col md={5}>
            <b>Universitas Katolik Parahyangan</b>
            <p className="lead m-0">Fakultas Teknologi Informasi dan Sains</p>
          </Col>
        </Row>
      </Container>
    </header>
    <header className="my-5 d-print-none">
      <Container>
        <Row>
          <Col>
            <Link to={backLink}><FontAwesomeIcon icon={faChevronLeft} /> Back to Exam Details</Link>
          </Col>
        </Row>
      </Container>
    </header>
  </>
  )
}

export default PaperHeader;