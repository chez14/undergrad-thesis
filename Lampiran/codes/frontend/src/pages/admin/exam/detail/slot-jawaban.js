import React, { useState } from 'react'
import { Row, Col, Button, Table, Modal, ModalBody, ModalHeader, ModalFooter, InputGroup, Input, InputGroupAddon } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFileDownload } from '@fortawesome/free-solid-svg-icons'
import { axios } from '~/apicall'
import fileDownload from 'js-file-download'
import { useAdminStore } from '~/components/use-store'
import SlotJawabanChild from './slot-jawaban-child'

function SlotJawaban({ exam }) {
    const [openSlotAdder, setOpenSlotAdder] = useState(false)
    const [slotAdding, setSlotAdding] = useState(false)

    const [inputLeft, setInputLeft] = useState(undefined)
    const [inputRight, setInputRight] = useState(undefined)

    const adminStore = useAdminStore();

    function handleAnswerBundleDownload() {
        axios.get("manage/exam/" + exam._id + "/answers", {
            responseType: "blob"
        }).then((resp) => {
            fileDownload(resp.data, resp.headers['x-filename']);
        })
    }

    function handleAnswerSlotInsert() {
        setSlotAdding(true)
        axios.post("manage/answerslot", {
            exam: exam._id,
            format: inputLeft + "%xxyyy%" + inputRight
        }).then(() => {
            adminStore.examFetch(exam._id);
        }).finally(() => {
            setSlotAdding(false)
            setOpenSlotAdder(false);
            setInputLeft(undefined);
            setInputRight(undefined);
        })
    }
    return (
        <div>
            <Row>
                <Col>
                    <h3>Slot jawaban</h3>
                </Col>
                <Col>
                    <div className="text-right">
                        <Button className="mr-2" color="success" onClick={handleAnswerBundleDownload}><FontAwesomeIcon icon={faFileDownload} /> Zip Answers</Button>
                        <Button className="mr-2" color="primary" onClick={() => setOpenSlotAdder(true)}><FontAwesomeIcon icon={faPlus} /></Button>
                    </div>
                </Col>
            </Row>
            <Table>
                <tbody>
                    {(exam.answer_slot || []).map((ans, id) =>
                        <SlotJawabanChild answer_slot={ans} key={id} />
                    )}
                </tbody>
            </Table>
            <Modal size="md"
                isOpen={openSlotAdder}
                backdrop>
                <ModalHeader toggle={() => setOpenSlotAdder(false)}>Tambah Slot</ModalHeader>
                <ModalBody>
                    <p>Massukan format jawaban:</p>
                    <InputGroup>
                        <Input type="text" value={inputLeft} onChange={(e) => setInputLeft(e.target.value)} disabled={slotAdding} />
                        <InputGroupAddon addonType="append">xxyyy</InputGroupAddon>
                        <Input type="text" value={inputRight} onChange={(e) => setInputRight(e.target.value)} disabled={slotAdding} />
                    </InputGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setOpenSlotAdder(false)} disabled={slotAdding}>Batal</Button>
                    <Button color="primary" onClick={handleAnswerSlotInsert} disabled={slotAdding}>Tambah</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default SlotJawaban
