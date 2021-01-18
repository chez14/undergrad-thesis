import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

function NotifModal({ notification, onCloseRequested = () => { } }) {
    return (
        <Modal isOpen={!!notification} backdrop>
            <ModalHeader>{(notification || {}).title}</ModalHeader>
            <ModalBody>
                <div dangerouslySetInnerHTML={{ __html: (notification || {}).description }} />
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={onCloseRequested}>Tutup</Button>
            </ModalFooter>
        </Modal>
    )
}

export default NotifModal
