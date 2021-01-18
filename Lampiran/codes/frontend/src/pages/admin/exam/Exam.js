import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Button from "reactstrap/lib/Button";
import Badge from "reactstrap/lib/Badge";
import Table from "reactstrap/lib/Table";
import { If, Then, Else } from 'react-if';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from "moment";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useAdminStore } from '~/components/use-store';

function Exam() {
  const adminStore = useAdminStore();
  useEffect(() => {
    adminStore.examFetch();
    console.log("Fetching examination...");
    return () => { };
  }, [adminStore])

  const [prepareDelete, setPrepareDelete] = useState({})

  function handleDelete() {
    adminStore.examDelete(prepareDelete._id).then(() => {
      setPrepareDelete({});
    })
  }
  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <h1>Ujian</h1>
        </Col>
        <Col>
          <div className="text-right">
            <Button color="primary" size="lg" tag={Link} to="/admin/exam/new">Create New</Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped>
            <thead>
              <tr>
                <th>Lecture Info</th>
                <th>Shift</th>
                <th colSpan={2}>Duration (Start-End)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {adminStore.exams.map((exam, i) =>
                <tr key={i}>
                  <td>
                    <b>{(exam.lecture || {}).name} ({(exam.lecture || {}).lecture_code})</b> <br />
                    {(exam.lecture_period || {}).period_code} <Badge color={exam.uts ? "success" : "info"}>{exam.uts ? "UTS" : "UAS"}</Badge>
                  </td>
                  <td>
                    <p className="h3">
                      <If condition={exam.shift === null}>
                        <Then>-</Then>
                        <Else>{exam.shift}</Else>
                      </If>
                    </p>
                  </td>
                  <td>
                    {exam.time_start} - {exam.time_ended}
                  </td>
                  <td>
                    Durasi: {exam.time_duration / 60} Menit<br />
                    Dimulai pada: {exam.time_opened || "(belum di mulai)"}
                  </td>
                  <td className="text-right">
                    <Button className="mx-2 d-none d-md-block" color="warning" tag={Link} to={`/admin/exam/${exam._id}/detail`}>Lihat</Button>
                    <Button className="mx-2 d-block d-md-none" color="warning" tag={Link} to={`/admin/exam/${exam._id}/minipanel`}>Lihat</Button>
                    <Button className="mx-2" color="danger" onClick={() => setPrepareDelete(exam)}>Hapus</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal isOpen={!!(prepareDelete._id)} toggle={() => setPrepareDelete({})} backdrop>
        <ModalHeader toggle={() => setPrepareDelete({})}>Konfirmasi Hapus</ModalHeader>
        <ModalBody>
          <h4>Are you sure to delete this exam?</h4>
          <h3>#{prepareDelete._id} <Badge color={prepareDelete.uts ? "info" : "success"}>{prepareDelete.uts ? "UTS" : "UAS"}</Badge> {prepareDelete.lecture?.name} ({(prepareDelete.lecture || {}).lecture_code})</h3>
          <p className="lead"> {(prepareDelete.shift === 0) ? "Shiftless" : ("Shift " + prepareDelete.shift)} | {moment(prepareDelete.time_start).format("LLLL")} | {prepareDelete.duration / 60} Menit.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setPrepareDelete({})}>Cancel</Button>{' '}
          <Button color="danger" onClick={handleDelete}><FontAwesomeIcon icon={faTrash} /> Hapus</Button>
        </ModalFooter>
      </Modal>

    </Container >)
}


export default observer(Exam)