import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { Container, Row, Col, Badge, Table } from 'reactstrap';
import { useAdminStore } from '~/components/use-store';
import PaperHeader from './PaperHeader';
import { observer } from 'mobx-react';
import { axios } from '~/apicall';
import moment from "moment";
import { When, If, Then, Else } from 'react-if';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createUseStyles } from 'react-jss';

const useStyle = createUseStyles(({
  root: {
    "&>section": {
      pageBreakBefore: "always"
    },
    "&>section:first-child": {
      pageBreakBefore: "avoid"
    },

    "& table td": {
      verticalAlign: "middle"
    },
    "& table tr > *": {
      borderColor: "black !important",
      borderWidth: "3px !important"
    },
    "& .table-striped tbody tr:nth-of-type(odd)": {
      backgroundColor: "rgba(0,0,0,0.3) !important"
    }
  }
}))

function Participants() {
  const path = useRouteMatch("/admin/exam/:id/participant/:type");
  const adminStore = useAdminStore();

  // eslint-disable-next-line
  const [participantByRoom, setParticipantByRoom] = useState([])
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState({})

  useEffect(() => {
    adminStore.selectedExam = path.params.id;
    adminStore.examFetch(path.params.id);

    axios.get("manage/exam/" + path.params.id + "/participants").then(resp => {
      let participantByRoom = {};
      resp.data.data.forEach(el => {
        if (!participantByRoom.hasOwnProperty(el.computer.location)) {
          participantByRoom[el.computer.location] = {
            location: el.computer.location,
            participants: []
          }
        }
        participantByRoom[el.computer.location].participants.push(el)
      })
      setParticipantByRoom(Object.values(participantByRoom));
      // setParticipants(resp.data.data);
      // setIsLoading(false);
    });

    axios.get("manage/location").then(resp => {
      let loka = {};
      resp.data.data.forEach(el => {
        loka[el._id] = { ...el, ...{ computers: null } };
      })
      setLocations(loka);
    })
    return () => { };
  }, [adminStore, path.params.id]);

  const styles = useStyle();
  return (
    <div className={styles.root}>
      {participantByRoom.map(({ location, participants }, id) => <section key={id}>
        <PaperHeader backLink={"/admin/exam/" + path.params.id + "/detail"} />
        <Container>
          <Row className="justify-content-center">
            <Col xs={12}>
              <div className="text-center mb-3">
                <h4>Ujian {adminStore.exam.uts ? "Tengah" : "Akhir"} Semester</h4>
                <h3><small>{adminStore.exam.lecture.lecture_code}</small> - {adminStore.exam.lecture.name}</h3>
                <p className="lead">
                  <When condition={adminStore.exam.shift !== 0}>
                    <Badge color={adminStore.exam.uts ? "info" : "success"}>Shift {adminStore.exam.shift}</Badge> {' '}
                  </When>
                  {moment(adminStore.exam.time_start).format("LLLL")}
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="text-center lead"> Ruangan {(locations[location] || {}).room_name || "#" + location}</p>
              <If condition={path.params.type === "signature"}>
                <Then>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th width="5%">No</th>
                        <th width="10%">Seat</th>
                        <th width="15%">NPM</th>
                        <th width="30%">Name</th>
                        <th width="20%">Signature</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.sort((a, b) => a.computer.name.localeCompare(b.computer.name)).map((par, i) => {
                        return <tr key={i}>
                          <td>{i + 1}</td>
                          <td><FontAwesomeIcon icon={faDesktop} /> {par.computer.name}</td>
                          <td className="text-monospace">{par.npm}</td>
                          <td>{par.display_name}</td>
                          <td></td>
                        </tr>
                      })}
                    </tbody>
                  </Table>
                </Then>
                <Else>
                  <div style={{ columnCount: 2 }}>
                    <Table striped>
                      <thead>
                        <tr className="text-center">
                          <th>Seat</th>
                          <th>NPM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participants.sort((a, b) => a.username.localeCompare(b.username)).map((par, i) => {
                          return <tr key={i}>
                            <td className="text-center"><FontAwesomeIcon icon={faDesktop} /> {par.computer.name}</td>
                            <td className="text-center text-monospace">{par.npm}</td>
                          </tr>
                        })}
                      </tbody>
                    </Table>
                  </div>
                </Else>
              </If>
            </Col>
          </Row>
        </Container>
      </section>
      )};
  </div>)
}


export default observer(Participants);