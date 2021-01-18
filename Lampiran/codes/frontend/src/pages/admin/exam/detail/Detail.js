import { faBriefcase, faDesktop, faFileCode, faTable } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fileDownload from 'js-file-download';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { Else, If, Then, When } from 'react-if';
import { Link } from "react-router-dom";
import Badge from "reactstrap/lib/Badge";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Table from "reactstrap/lib/Table";
import { axios } from '~/apicall';
import { useAdminStore } from '~/components/use-store';
import ExamDetailAutoreport from './autoreport/autreport';
import AdminExamMigrator from "./migrator/migrator";
import ExamNotificationLister from './notifications/lister';
import SlotJawaban from './slot-jawaban';


function Detail({ match }) {
  const adminStore = useAdminStore();
  const { exam } = adminStore;
  // console.log("exams", exam);

  const [showOpenMigratorTool, setShowOpenMigratorTool] = useState(false)

  useEffect(() => {
    adminStore.selectedExam = match.params.id;
    adminStore.examFetch(match.params.id);
    return () => {
    };
  }, [adminStore, match])

  function handleSCriptDownload() {
    axios.get("manage/exam/" + match.params.id + "/script", {
      responseType: 'blob'
    }).then((data) => {
      fileDownload(data.data, data.headers['x-filename']);
    });
  }

  return (<>
    <div className="bg-success text-white py-5 mb-3">
      <If condition={!!exam._id && !adminStore.isLoading}>
        <Then>
          <Container>
            <Row className="my-3 align-items-center">
              <Col>
                <h5>{exam.lecture.lecture_code} <When condition={exam.shift !== 0}><Badge color="light">SHIFT-{exam.shift}</Badge></When></h5>
                <h2 className="font-weight-bold">{exam.lecture.name}</h2>
              </Col>
              <Col>
                <div className="text-right">
                  <p className="h3">
                    <If condition={exam?.time_opened && exam?.time_left > 0}>
                      <Then>
                        <b><Countdown date={Date.now() + (exam.time_left * 1000)} className="d-flex mx-3" autoStart={!!exam.time_opened} /></b><br />
                        <Badge color="danger">ON-GOING</Badge>
                      </Then>
                      <Else>
                        <If condition={exam?.time_left === 0}>
                          <Then>
                            <Badge color="light">FINISHED</Badge>
                          </Then>
                          <Else>
                            <Badge color="warning">STANDBY</Badge>
                          </Else>
                        </If>
                      </Else>
                    </If>
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </Then>
        <Else>
          <If condition={!adminStore.isLoading}>
            <Then>
              <Container>
                <h3>Not found</h3>
              </Container>
            </Then>
            <Else>
              <Container>
                <h3>Loading...</h3>
              </Container>
            </Else>
          </If>
        </Else>
      </If>
    </div>
    <Container>
      <Row>
        <Col>
          <h6>Tools</h6>
          <Button className="mr-3" tag={Link} to={"/admin/exam/" + match.params.id + "/participant/signature"}><FontAwesomeIcon icon={faTable} /> Daftar Hadir (Tanda Tangan)</Button>
          <Button className="mr-3" tag={Link} to={"/admin/exam/" + match.params.id + "/participant/door"}><FontAwesomeIcon icon={faTable} /> Daftar Hadir (Pintu)</Button>
          <Button className="mr-3" tag={Link} to={"/admin/exam/" + match.params.id + "/screen"}><FontAwesomeIcon icon={faDesktop} /> Layar Proyektor</Button>
          <Button className="mr-3" color="info" onClick={handleSCriptDownload}><FontAwesomeIcon icon={faFileCode} /> Download Script</Button>
          <Button className="mr-3" color="warning" onClick={() => setShowOpenMigratorTool(true)}><FontAwesomeIcon icon={faBriefcase} /> Pindah Peserta</Button>

          {/* Migrator Tool */}
          <AdminExamMigrator isOpen={showOpenMigratorTool} participants={exam.participants || []} onUpdated={() => adminStore.examFetch(match.params.id)} onCloseRequested={() => setShowOpenMigratorTool(false)} />
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="my-4">
            <h3>Informasi Ujian <Button color="warning" tag={Link} to={"/admin/manage/exams/" + match.params.id + "?referral=" + window.location.pathname}>Ubah</Button></h3>
            <Row>
              <Col>
                <Table>
                  <tbody>
                    <tr>
                      <th>Mata Kuliah</th>
                      <td>{exam.lecture.name} ({exam.lecture.lecture_code})</td>
                    </tr>
                    <tr>
                      <th>Tahun Ajaran</th>
                      <td>{exam.lecture_period.period_code}</td>
                    </tr>
                    <tr>
                      <th>Mulai - Berakhir</th>
                      <td>{exam.time_opened} - {exam.time_ended}</td>
                    </tr>
                    <tr>
                      <th>Waktu Mulai Pengumpulan</th>
                      <td>{exam.time_start}</td>
                    </tr>
                    <tr>
                      <th>Durasi</th>
                      <td>{exam.time_duration / 60} Menit</td>
                    </tr>
                    <tr>
                      <th>Uts/Uas</th>
                      <td>{exam.uts ? "UTS" : "UAS"}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col>
                <Table>
                  <tbody>
                    <tr>
                      <th>Jumlah Peserta</th>
                      <td>{(exam.participants || []).length} Orang</td>
                    </tr>
                    <tr>
                      <th>Dibuat pada</th>
                      <td>{exam.created_on}</td>
                    </tr>
                    <tr>
                      <th>Terakhir diperbaharui</th>
                      <td>{exam.updated_on}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <SlotJawaban exam={exam} />
        </Col>
        <Col xs={6}>
          <ExamNotificationLister exam={exam} />
        </Col>
        <Col xs={6}>
          <ExamDetailAutoreport exam={exam} />
        </Col>
      </Row>
    </Container>
  </>
  )
}

export default observer(Detail);