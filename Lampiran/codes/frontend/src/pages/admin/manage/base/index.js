import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Button, Col, Container, Row, Table } from 'reactstrap';
import { useEntityStore } from '~/components/use-store';
import EntityDeletor from './delete';

function EntityIndex({ entityRules }) {
    const match = useRouteMatch("/admin/manage/:entity");
    const entityStore = useEntityStore();
    const [itemToDelete, setItemToDelete] = useState(undefined)

    const refetchItemData = useCallback(
        () => {
            entityStore.fetch(entityRules.apiPath);
        },
        [entityStore, entityRules],
    )

    function handleDeleteRequest(item) {
        setItemToDelete(item);
    }

    function handleDeleteSuccess() {
        refetchItemData();
        setItemToDelete(undefined);
    }

    //refetch items
    useEffect(() => {
        entityStore.selectedEntity = entityRules.apiPath;
        refetchItemData();
        return () => { };
    }, [entityStore, entityRules, refetchItemData])


    let tableHeader = entityRules.list_display.map((e) => (e.includes(':') ? e.split(":") : e));

    return (
        <div className="my-5">
            <Container>
                <Row>
                    <Col xs={12} md={8}>
                        <h2 className="text-monospace"><span className="text-muted">Manage\</span>{entityRules.name.replace(/[\W]/, "_")}::<span className="text-info">index</span>()</h2>
                    </Col>
                    <Col xs={12} md={4}>
                        <div className="text-right">
                            <Button className="mx-2" color="success" tag={Link} to={match.url + "/new"}><FontAwesomeIcon icon={faPlus} />  Create New</Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div className="my-4">
                            <Table responsive striped>
                                <thead>
                                    <tr>
                                        {tableHeader.map(el => {
                                            let headerKey = Array.isArray(el) ? el.join(":") : el;
                                            return <th key={el}>
                                                {entityRules.fields[headerKey]?.name || headerKey}
                                            </th>
                                        })}
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entityStore.items.map(data => <tr key={"data-" + data._id}>
                                        {tableHeader.map(el => {
                                            let display = undefined;
                                            if (Array.isArray(el)) {
                                                display = data[el[0]]?.hasOwnProperty(el[1]) ? data[el[0]][el[1]] : data[el[0]];
                                            } else {
                                                display = (typeof (data[el]) === "object" ? JSON.stringify(data[el]) : data[el])
                                            }
                                            return <td key={el + "-" + data._id}>
                                                {display}
                                            </td>
                                        })}
                                        <td>
                                            <div className="text-right">
                                                <Button color="secondary" className="mx-2" tag={Link} to={match.url + "/" + data._id}>
                                                    <FontAwesomeIcon icon={faPen} />
                                                </Button>
                                                <Button color="danger" className="mx-2" onClick={() => handleDeleteRequest(data)}><FontAwesomeIcon icon={faTrash} /></Button>
                                            </div>
                                        </td>
                                    </tr>)}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Container>
            <EntityDeletor
                entityRules={entityRules}
                onDeleteCanceled={() => setItemToDelete(undefined)}
                onDeleteSucceed={handleDeleteSuccess}
                item={itemToDelete}
            />
        </div>
    )
}

export default observer(EntityIndex)
