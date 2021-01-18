import React, { useState } from 'react'
import { Row, Col, Button, Table, Alert, Modal, ModalHeader, ModalBody, Form, ModalFooter, FormText, FormGroup, Label, Input, Spinner } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import AutoreportChild from './autoreport-child'
import { useAdminStore } from '~/components/use-store'
import { axios } from '~/apicall'
import moment from "moment"
import { Else, If, Then } from 'react-if'

function ExamDetailAutoreport({ exam }) {
    const adminStore = useAdminStore();

    const [showAddExamReportModal, setShowAddExamReportModal] = useState(false)
    const [dataToDelete, setDataToDelete] = useState(undefined)
    const [dataToSend, setDataToSend] = useState(undefined)
    const [sending, setSending] = useState(false)

    const [emailInput, setEmailInput] = useState("")


    function refreshExamReport() {
        adminStore.examFetch(exam._id)
    }

    function handleAutoReportCreation(e) {
        e.preventDefault();
        let validuntil = moment().add('7', 'days').format("YYYY-MM-DD HH:mm:ss");
        axios.post("manage/examreport", {
            tos: emailInput,
            valid_until: validuntil,
            exam: exam._id
        }).then(response => {
            setShowAddExamReportModal(false);
            refreshExamReport();
        })
    }

    function handleDeleteRequest() {
        axios.delete("manage/examreport/" + dataToDelete._id).then((d) => {
            setDataToDelete(undefined);
            refreshExamReport();
        })
    }

    function handleSendRequest() {
        setSending(true);
        axios.post("manage/examreport/" + dataToSend._id + "/forcesend").then((d) => {
            setDataToSend(undefined);
            setSending(false);
            refreshExamReport();
        })
    }


    return (
        <div>
            <Row>
                <Col>
                    <h3>Autoreport</h3>
                </Col>
                <Col>
                    <div className="text-right">
                        <Button className="mr-2" color="primary" onClick={() => setShowAddExamReportModal(true)} > <FontAwesomeIcon icon={faPlus} /></Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Alert color="secondary">
                        Autoreport akan berjalan via Cronjob sesuai dengan konfigurasi yang telah dilakukan.
                        Sebuah email akan dikirimkan ke alamat yang telah ditentukan secara otomatis setelah ujian selesai.
                    </Alert>
                    <Table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Kadaluarsa</th>
                                <th>Terkirim</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {(exam.exam_report || []).map((data, i) => <AutoreportChild key={i} examReport={data} onDeleteRequest={setDataToDelete} onSendRequest={setDataToSend} />)}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Modal isOpen={showAddExamReportModal} backdrop>
                <Form onSubmit={handleAutoReportCreation}>
                    <ModalHeader>Tambah Autoreport</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input type="text" value={emailInput} onChange={e => setEmailInput(e.target.value)} />
                            <FormText>Pisahkan dengan koma untuk email lebih dari satu.</FormText>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setShowAddExamReportModal(false)}>Batal</Button>
                        <Button color="primary">Buat</Button>
                    </ModalFooter>
                </Form>
            </Modal>

            <Modal isOpen={!!dataToDelete} backdrop>
                <ModalHeader>Konfirmasi penghapusan</ModalHeader>
                <ModalBody>
                    Apakah anda yakin ingin menghapus autoreport untuk email <code>{(dataToDelete || {}).tos}</code>?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => setDataToDelete(undefined)}>Batalkan</Button>
                    <Button color="secondary" onClick={handleDeleteRequest}>Hapus</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={!!dataToSend} backdrop>
                <ModalHeader>Konfirmasi Pengiriman</ModalHeader>
                <ModalBody>
                    Apakah anda yakin ingin mengirim jawaban ke email <code>{(dataToSend || {}).tos}</code>?
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setDataToSend(undefined)} disabled={sending}>Batalkan</Button>
                    <Button color="info" onClick={handleSendRequest} disabled={sending}>
                        <If condition={sending}>
                            <Then>
                                <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                            </Then>
                            <Else>
                                Kirimkan
                            </Else>
                        </If>

                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default ExamDetailAutoreport
