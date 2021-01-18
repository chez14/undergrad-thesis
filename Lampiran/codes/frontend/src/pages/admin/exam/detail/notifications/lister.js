import React, { useState, useEffect, useCallback } from 'react'
import { Row, Col, Button, Table, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, Input, FormText, Form } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { axios } from '~/apicall';
import NotificationListerChild from './lister-child';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditor, { buttonList } from 'suneditor-react';
import NotificationAudiencePicker from './auidience-picker'
import { When } from 'react-if';

function ExamNotificationLister({ exam }) {

    const [notifications, setNotifications] = useState([]);
    const [showNewNotificationsModal, setShowNewNotificationsModal] = useState(false)
    const [showPasswordNotifModal, setShowPasswordNotifModal] = useState(false)
    const [showCustomNotifModal, setShowCustomNotifModal] = useState(false)

    const [nniServiceList, setNniServiceList] = useState("");
    const [nniPasswordList, setNniPasswordList] = useState("");

    const [customNotificationParticipants, setCustomNotificationParticipants] = useState([])
    const [customNotificationTitle, setCustomNotificationTitle] = useState(undefined)
    const [customNotificationDescription, setCustomNotificationDescription] = useState(undefined)

    const [audiencePickerShow, setAudiencePickerShow] = useState(false)

    const [participantLister, setParticipantLister] = useState({});
    useEffect(() => {
        let partici = {};
        (exam.participants || []).forEach((par) => {
            partici[par.npm] = par;
        });

        setParticipantLister(partici);
        return () => { }
    }, [exam])

    let refreshNotifications = useCallback(
        (exam) => {
            axios.get("manage/exam/" + exam._id + "/notifications").then((response) => {
                setNotifications(response.data.data.map(data => {
                    data.participants = data.participants.map((e) => e._id) // just need to list their id.
                    return data;
                }));
            })
        },
        [],
    )

    useEffect(() => {
        refreshNotifications(exam);
        return () => { }
    }, [exam, refreshNotifications])


    // transform passwordlist
    let transformedPasslist = nniPasswordList.split("\n").map((line) => line.split("|"));

    function handleGenMass(e) {
        e.preventDefault();
        // handle shit
        axios.post("manage/notification/mass_gen", {
            lists: transformedPasslist.map((line) => {
                let [parti, uname = "", pass = ""] = line;

                if (!participantLister.hasOwnProperty(parti)) {
                    throw new Error("NPM tidak valid " + parti)
                }

                return {
                    participant: participantLister[parti]._id,
                    username: uname,
                    password: pass
                }
            }),
            url: nniServiceList
        }).then((response) => {
            //done.
            setShowPasswordNotifModal(false);
            refreshNotifications(exam);
        }).catch(alert);
    }

    function handleCustomNotifCreateRequest(e) {
        e.preventDefault();
        if (customNotificationParticipants.length === 0) {
            return alert("Penerima notifikasi belum di pilih.");
        }
        axios.post("manage/notification", {
            title: customNotificationTitle,
            description: customNotificationDescription,
            type: "custom",
            participants: customNotificationParticipants
        }).then((response) => {
            setShowCustomNotifModal(false);
            refreshNotifications(exam);
        })
    }
    return (
        <div>
            <Row>
                <Col>
                    <h3>Notifikasi</h3>
                </Col>
                <Col>
                    <div className="text-right">
                        <Button className="mr-2" color="primary" onClick={() => setShowNewNotificationsModal(true)}><FontAwesomeIcon icon={faPlus} /></Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table>
                        <tbody>
                            {notifications.map((notif) => <NotificationListerChild key={"notif-" + notif._id} notif={notif} onDeleted={() => refreshNotifications(exam)} onEdited={() => refreshNotifications(exam)} />)}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Modal isOpen={showNewNotificationsModal}>
                <ModalHeader>Pilih jenis notifikasi yang ingin diberikan:</ModalHeader>
                <ModalBody>
                    <Button block onClick={() => {
                        setShowNewNotificationsModal(false);
                        setShowPasswordNotifModal(true);
                    }}>
                        <b>Password</b><br />
                        <small>Gunakan jenis ini untuk menyebarkan informasi mengenai password untuk tiap peserta.</small>
                    </Button>
                    <Button block onClick={() => {
                        setShowNewNotificationsModal(false);
                        setShowCustomNotifModal(true);
                    }}>
                        <b>Lainnya</b><br />
                        <small>Gunakan jenis ini untuk memberikan informasi pada peserta.</small>
                    </Button>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setShowNewNotificationsModal(false)}>Batal</Button>
                </ModalFooter>
            </Modal>

            {/* Modal buat tambah notifikasi */}
            <Modal isOpen={showPasswordNotifModal} size="xl">
                <Form onSubmit={handleGenMass}>
                    <ModalHeader>Notifikasi Password Akun</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>Service/Url</Label>
                                    <Input name="service" placeholder="Contoh: judgeujian.ftis.unpar" onChange={(e) => setNniServiceList(e.target.value)} value={nniServiceList} required />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Daftar Password</Label>
                                    <Input type="textarea" name="passwords" onChange={(e) => setNniPasswordList(e.target.value)} value={nniPasswordList} required />
                                    <FormText color="muted">Bentuk daftar password adalah <code>npm | username service | password</code>.</FormText>
                                </FormGroup>
                            </Col>
                            <Col>
                                <Table bordered striped>
                                    <thead>
                                        <tr>
                                            <th>NPM - Username</th>
                                            <th>Service Username</th>
                                            <th>Service Password</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transformedPasslist.map((data) => {
                                            let [npm = "", uname = "", pass = ""] = data;

                                            if (!participantLister.hasOwnProperty(npm)) {
                                                return <tr>
                                                    <td colSpan={3} className="text-danger"><i>{npm} tidak ditemukan.</i></td>
                                                </tr>
                                            }

                                            return <tr>
                                                <td>{npm} - {participantLister[npm].username}</td>
                                                <td>{uname}</td>
                                                <td>{pass}</td>
                                            </tr>
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => setShowPasswordNotifModal(false)}>Batal</Button>
                        <Button type="submit">Sebarkan</Button>
                    </ModalFooter>
                </Form>
            </Modal>

            {/* Add modal for special users */}
            <Modal isOpen={showCustomNotifModal} size="lg" backdrop>
                <Form onSubmit={handleCustomNotifCreateRequest}>
                    <ModalHeader>Tambah Notifikasi Kustom</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label>Judul</Label>
                            <Input type="text" defaultValue={customNotificationTitle} onChange={(e) => setCustomNotificationTitle(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Penerima Notifikasi</Label>
                            <Input plaintext value={customNotificationParticipants.length + " orang, (klik untuk mengubah)"} onClick={() => setAudiencePickerShow(true)} onChange={() => { }} />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Deskripsi
                            </Label>
                            <SunEditor setOptions={{ buttonList: buttonList.formatting, height: 200 }} setContents={customNotificationDescription} onChange={(val) => setCustomNotificationDescription(val)} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="secondary" onClick={() => setShowCustomNotifModal(false)}>Batal</Button>
                        <Button type="submit" color="primary">Buat</Button>
                    </ModalFooter>
                </Form>
            </Modal>

            {/* Modal pendukung */}
            <When condition={audiencePickerShow}>
                <NotificationAudiencePicker participants={exam.participants} selectedAudiences={customNotificationParticipants} onSelected={(val) => {
                    setCustomNotificationParticipants(val)
                    setAudiencePickerShow(false)
                }} onCanceled={() => setAudiencePickerShow(false)} />
            </When>
        </div>
    )
}

export default ExamNotificationLister
