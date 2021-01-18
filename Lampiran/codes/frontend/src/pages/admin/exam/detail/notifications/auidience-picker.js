import React, { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalBody, Table, Input, Button, ModalFooter } from 'reactstrap'

function NotificationAudiencePicker({ participants = [], onSelected = () => { }, selectedAudiences = [], onCanceled = () => { } }) {

    const [_selectedAudiences, set_SelectedAudiences] = useState(selectedAudiences)

    useEffect(() => {
        set_SelectedAudiences(selectedAudiences)
        return () => { }
    }, [selectedAudiences])

    function handleSelectAll() {
        set_SelectedAudiences(participants.map((data) => data._id));
    }

    function handleCheckChange(e, participant) {
        if (e.target.checked) {
            set_SelectedAudiences([..._selectedAudiences, participant._id])
        } else {
            set_SelectedAudiences([..._selectedAudiences.filter((data) => data !== participant._id)]);
        }
    }

    return (
        <>
            <Modal isOpen backdrop>
                <ModalHeader>Pilih Penemrima Notifikasi</ModalHeader>
                <ModalBody>
                    <div>
                        <Button onClick={handleSelectAll}>Pilih semua</Button>
                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Nama & Username</th>
                                <th>NPM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((participant) => <tr key={"participant-" + participant._id}>
                                <td><Input type="checkbox" checked={_selectedAudiences.includes(participant._id)} onChange={(e) => handleCheckChange(e, participant)} /></td>
                                <td>{participant.name} - <code>{participant.username}</code></td>
                                <td>{participant.npm}</td>
                            </tr>)}
                        </tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onCanceled}>Batal</Button>
                    <Button onClick={() => onSelected(_selectedAudiences)}>Selesai</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default NotificationAudiencePicker
