import React from 'react'
import { faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'reactstrap'

function AutoreportChild({ examReport = {}, onDeleteRequest = () => { }, onSendRequest = () => { } }) {
    return (
        <>
            <tr>
                <td>{examReport.tos}</td>
                <td>{examReport.valid_until}</td>
                <td>{examReport.sent_on || "Belum"}</td>
                <td>
                    <Button color="info" onClick={() => onSendRequest(examReport)}><FontAwesomeIcon icon={faPaperPlane} /></Button>
                    <Button color="danger" onClick={() => onDeleteRequest(examReport)}><FontAwesomeIcon icon={faTrash} /></Button>
                </td>
            </tr>

        </>
    )
}

export default AutoreportChild
