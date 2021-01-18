import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import { useEntityStore } from '~/components/use-store';

function EntityDeletor({ onDeleteSucceed = () => { }, onDeleteCanceled = () => { }, entityRules, item = null }) {
    let entityStore = useEntityStore()
    let fields = entityRules.fields;

    function handleDeleteRequest() {
        entityStore.deleteItem(entityRules.apiPath, item?._id).then(() => onDeleteSucceed());
    }

    return (
        <Modal isOpen={!!item} toggle={() => onDeleteCanceled}>
            <ModalHeader>
                Delete Confirmation
            </ModalHeader>
            <ModalBody>
                <Table bordered style={{ columns: 2 }}>
                    <tbody>
                        {Object.keys(fields).map((el) => {
                            let content = item?.[el] || "";
                            if (fields[el].type === "link") {
                                content = item?.[el]?.[fields[el]?.link_label];
                            } else if (fields[el].type === "links") {
                                content = item?.[el]?.map(item => item[fields[el]?.link_label]).join(", ");
                            } else if (fields[el].type === "json") {
                                content = <pre class="pre">{JSON.stringify(item?.[el], "", 2)}</pre>
                            }
                            return <tr key={el}>
                                <th>{fields[el].name || el}</th>
                                <td>{(content)}</td>
                            </tr>
                        })}
                    </tbody>
                </Table>
                <hr />
                <p>Are you sure to delete this {entityRules.name}?</p>
            </ModalBody>
            <ModalFooter>
                <Button type="button" color="danger" onClick={handleDeleteRequest}>Delete</Button>
                <Button type="button" color="secondary" onClick={() => onDeleteCanceled()}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}

export default EntityDeletor
