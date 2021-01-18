import { faCheck, faPen, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Else, If, Then } from 'react-if'
import { Button, Input, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { axios } from '~/apicall'
import { useAdminStore } from '~/components/use-store'

function SlotJawabanChild({ answer_slot }) {

    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)
    const [letEdit, setLetEdit] = useState(false);

    const [inputFormat, setInputFormat] = useState(answer_slot.format)

    const adminStore = useAdminStore();

    function handleConfirmDelete() {
        axios.delete("manage/answerslot/" + answer_slot._id).then(() => {
            adminStore.examFetch(adminStore.selectedExam);
        })
    }

    function handleSlotUpdate() {
        axios.put("manage/answerslot/" + answer_slot._id, {
            format: inputFormat
        }).then(() => {
            adminStore.examFetch(adminStore.selectedExam);
            setLetEdit(false);
        })
    }
    return (<>
        <tr>
            <If condition={!letEdit}>
                <Then>
                    <td>
                        <p className="font-monospace font-weight-bold">
                            {answer_slot.format}
                        </p>
                    </td>
                    <td className="text-right">
                        <Button className="ml-2" color="secondary" onClick={() => setLetEdit(true)}><FontAwesomeIcon icon={faPen} /></Button>
                        <Button className="ml-2" color="danger" onClick={() => setOpenDeleteConfirm(true)}><FontAwesomeIcon icon={faTrash} /></Button>
                    </td>
                </Then>
                <Else>
                    <td>
                        <Input type="text" defaultValue={inputFormat} onChange={(e) => setInputFormat(e.target.value)} />
                    </td>
                    <td>
                        <Button className="ml-2" color="primary" onClick={handleSlotUpdate}><FontAwesomeIcon icon={faCheck} /></Button>
                        <Button className="ml-2" color="danger" onClick={() => {
                            setLetEdit(false)
                        }}><FontAwesomeIcon icon={faTimes} /></Button>
                    </td>
                </Else>
            </If>
        </tr>
        <Modal isOpen={openDeleteConfirm} toggle={() => setOpenDeleteConfirm(!openDeleteConfirm)} backdrop>
            <ModalBody>
                <p>
                    Are you sure to delete <span className="font-monospace">{answer_slot.format}</span>
                </p>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
                <Button color="danger" onClick={handleConfirmDelete}><FontAwesomeIcon icon={faTrash} /> Delete</Button>
            </ModalFooter>
        </Modal>
    </>
    )
}

export default SlotJawabanChild
