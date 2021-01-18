import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { axios } from '~/apicall'
import 'suneditor/dist/css/suneditor.min.css';
import SunEditor, { buttonList } from 'suneditor-react';
import NotificationAudiencePicker from './auidience-picker'
import { useAdminStore } from '~/components/use-store'
import { When } from 'react-if'
import { observer } from 'mobx-react'


function NotificationListerChild({ notif = {}, onDeleted = () => { }, onEdited = () => { } }) {
    const [deleteRequested, setDeleteRequested] = useState(false)

    const [notification, setNotification] = useState(notif); // used for editors
    const [editOpen, setEditOpen] = useState(false);
    const [audiencePickerShow, setAudiencePickerShow] = useState(false)

    const adminStore = useAdminStore();
    const exam = adminStore.exam;

    function handleDeleteRequest() {
        axios.put("manage/notification/" + notif._id, { description: notif.description, title: notif.title, participants: [] }).then(() => {
            return axios.delete("manage/notification/" + notif._id + "")
        }).then((resp) => {
            setDeleteRequested(false);
            onDeleted(notif);
        })
    }

    function handleEditRequest() {
        let notifFiltered = { ...notification };
        delete notifFiltered['_id'];
        delete notifFiltered['created_on'];
        delete notifFiltered['updated_on'];
        delete notifFiltered['deleted_on'];

        axios.put("manage/notification/" + notif._id, notifFiltered).then((resp) => {
            onEdited(resp.data.data);
            setEditOpen(false);
        })
    }

    return (
        <>
            <tr>
                <td>
                    {notif.title}
                </td>
                <td style={{ textAlign: "right" }}>
                    <Button className="ml-2" onClick={() => setEditOpen(true)}><FontAwesomeIcon icon={faPen} /></Button>
                    <Button className="ml-2" color="danger" onClick={() => setDeleteRequested(true)}><FontAwesomeIcon icon={faTrash} /></Button>
                </td>
            </tr>
            <Modal isOpen={deleteRequested} backdrop>
                <ModalHeader>Konfirmasi</ModalHeader>
                <ModalBody>
                    <p>Apakah anda yakin untuk menghapus notifikasi ini?</p>
                    <div className="p-4 bg-dark text-light">
                        <div dangerouslySetInnerHTML={{ __html: notif.description }} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={handleDeleteRequest}>Hapus</Button>
                    <Button color="primary" onClick={() => setDeleteRequested(false)}>Batal</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={editOpen} size="lg" backdrop>
                <ModalHeader>Ubah Notifikasi</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Judul</Label>
                            <Input type="text" defaultValue={notification.title} onChange={(e) => setNotification({ ...notification, title: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Penerima Notifikasi</Label>
                            <Input plaintext value={notification.participants.length + " orang, (klik untuk mengubah)"} onClick={() => setAudiencePickerShow(true)} onChange={() => { }} />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Deskripsi
                            </Label>
                            <SunEditor setOptions={{ buttonList: buttonList.formatting, height: 200 }} setContents={notification.description} onChange={(val) => setNotification({ ...notification, description: val })} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => {
                        setNotification(notif); // reset
                        setEditOpen(false);
                    }}>Batal</Button>
                    <Button color="primary" onClick={handleEditRequest}>Simpan</Button>
                </ModalFooter>
            </Modal>

            {/* Modal pendukung */}
            <When condition={audiencePickerShow}>
                <NotificationAudiencePicker participants={exam.participants} selectedAudiences={notification.participants} onSelected={(val) => {
                    setNotification({ ...notification, participants: val })
                    setAudiencePickerShow(false)
                }} onCanceled={() => setAudiencePickerShow(false)} />
            </When>
        </>
    )
}

export default observer(NotificationListerChild)
