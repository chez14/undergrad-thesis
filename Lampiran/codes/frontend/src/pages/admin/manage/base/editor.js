import { faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Else, If, Then, When } from 'react-if';
import { Link, withRouter } from 'react-router-dom';
import { Alert, Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import DateTimePicker from '~/components/date-time-picker/date-time-picker';
import EntityDeletor from './delete';
import qs from 'query-string'


class EntityEditor extends Component {

    state = {
        field: [],
        message: [],
        itemToDelete: undefined,
        returnPath: undefined
    }

    componentDidMount() {
        const { match, entityStore, entityRules, globalEntityRules } = this.props;
        entityStore.selectedEntity = entityRules.apiPath;

        // FETCH all required shits.
        let fields = entityRules.fields;
        Object.keys(fields).forEach(el => {
            let theField = fields[el];

            if (theField.type === "link" || theField.type === "links") {
                entityStore.fetch(globalEntityRules[theField.table].apiPath, globalEntityRules[theField.table].apiPath);
            }
        });


        if (match.params.id !== "new") {
            entityStore.selectedEntityId = match.params.id;
            entityStore.fetchItem(entityRules.apiPath, match.params.id).then((data) => {
                let finalizedFields = {};
                Object.keys(fields).forEach(el => {
                    finalizedFields[el] = entityStore.item[el];
                    if (fields[el].type === "json") {
                        finalizedFields[el] = JSON.stringify(finalizedFields[el], null, 2);
                    }
                });

                this.setState({ field: finalizedFields })
            })
        } else {
            // set the loading false since we don't need to load anything when
            // it's new.
            entityStore.isLoading = false;
            // reset the entity store
            entityStore.selectedEntityId = undefined;
            this.setState({ field: {} });
        }

        let returnPath = "/admin/manage/" + entityRules.entityName;
        if (window.location.search) {
            let parsedQs = qs.parse(window.location.search);
            returnPath = parsedQs?.referral || returnPath;
        }
        this.setState({ returnPath: returnPath });
    }

    componentDidUpdate(prevProps, prevState) {
        const { match } = this.props;
        if (prevProps.match.params.id !== match.params.id) {
            this.setState({ field: {} });
        }
    }



    handleSubmit(e) {
        e.preventDefault();
        const { match, history, entityStore, entityRules, entityName } = this.props;
        const { field } = this.state;

        let fields = entityRules.fields;
        let finalizedFields = {};
        Object.keys(fields).filter((el) => ((fields[el].allow || {}).update || false)).forEach(el => {
            finalizedFields[el] = field[el] || entityStore.item[el];
            if (fields[el].type === "json") {
                finalizedFields[el] = JSON.parse(finalizedFields[el]);
            } else if (fields[el].type === "link") {
                finalizedFields[el] = (typeof finalizedFields[el] === "object") ? finalizedFields[el]._id : finalizedFields[el];
            } else if (fields[el].type === "links") {
                finalizedFields[el] = finalizedFields[el].map((item) => (typeof item === "object") ? item._id : item);
            }
        });

        if (match.params.id === "new") {
            // create things by invoking api call, when after we done, we can
            // redirect to entity editor with id loaded.
            entityStore
                .createItem(entityRules.apiPath, finalizedFields).then((data) => {
                    history.push("/admin/manage/" + entityName + "/" + data._id);
                    return Promise.resolve();
                });
        } else {
            entityStore
                .updateItem(entityRules.apiPath, match.params.id, finalizedFields).then(() => {
                    this.setState({ message: [{ color: "primary", data: "Updated successfully." }] })
                }).catch((err) => {
                    this.setState({ message: [{ color: "danger", data: "There's problem while updating your data: " + err.toString() }] })
                })
        }
    }

    render() {
        const { match, entityStore, entityRules, globalEntityRules, entityName } = this.props;
        const { field, message, itemToDelete, returnPath } = this.state;
        let fields = entityRules.fields;
        return (
            <div className="my-5">
                <Container>
                    <Row>
                        <Col xs={12} md={8}>
                            <h2 className="text-monospace">
                                <Link to={returnPath} title="Back" className="mr-3"><FontAwesomeIcon icon={faChevronLeft} /></Link>
                                <If condition={match.params.id === "new"}>
                                    <Then>
                                        <span className="text-muted">Manage\</span>{entityRules.name.replace(/[\W]/, "_")}::<span className="text-info">new</span>()
                                    </Then>
                                    <Else>
                                        <span className="text-muted">Manage\</span>{entityRules.name.replace(/[\W]/, "_")}::<span className="text-info">edit</span>({match.params.id})
                                </Else>
                                </If>
                            </h2>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="text-right">
                                <Button className="mx-2" color="success" tag={Link} to={"/admin/manage/" + entityName + "/new"}><FontAwesomeIcon icon={faPlus} /> Create New</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={8}>
                            {message.map((msg, id) => <Alert key={"msg-" + id} color={msg.color || "primary"} children={msg.data} />)}
                            <Form onSubmit={(e) => this.handleSubmit(e)}>
                                {Object.keys(fields).map((el, id) => {
                                    let theFieldDefinition = fields[el];
                                    let theComponent = undefined;

                                    if (theFieldDefinition.type === "link") {
                                        let entityLink = globalEntityRules[theFieldDefinition.table];

                                        theComponent = <Input
                                            type="select"
                                            value={field[el]?._id}
                                            disabled={!(theFieldDefinition?.allow?.update || false) || entityStore.isLoading}
                                            onChange={e => this.setState({ field: { ...field, [el]: e.target.value } })}>
                                            {entityStore.getEntityItems(entityLink.apiPath)?.map((item) => <option value={item._id} key={item._id}>
                                                {item[theFieldDefinition.link_label]}
                                            </option>)}
                                        </Input>
                                    } else if (theFieldDefinition.type === "links") {
                                        let entityLink = globalEntityRules[theFieldDefinition.table];

                                        theComponent = <Input
                                            type="select"
                                            multiple
                                            value={field[el]?.map((obj) => obj?._id || obj)}
                                            disabled={!(theFieldDefinition?.allow?.update || false) || entityStore.isLoading}
                                            onChange={e => this.setState({
                                                field: {
                                                    ...field,
                                                    [el]: Array.from(e.target.selectedOptions).map(e => e.value)
                                                }
                                            })}>

                                            {entityStore.getEntityItems(entityLink.apiPath)?.map((item) => <option value={item._id} key={item._id}>
                                                {item[theFieldDefinition.link_label]}
                                            </option>)}

                                        </Input>
                                    } else if (theFieldDefinition.type === "json") {
                                        // try parse:
                                        let parseAble = false;
                                        try {
                                            JSON.parse(field[el]);
                                            parseAble = true;
                                        } catch (e) {

                                        }
                                        theComponent = <>
                                            <Input
                                                type="textarea"
                                                rows={10}
                                                invalid={!parseAble}
                                                defaultValue={field[el]}
                                                disabled={!(theFieldDefinition?.allow?.update || false) || entityStore.isLoading}
                                                onChange={e => this.setState({ field: { ...field, [el]: e.target.value } })} />
                                        </>

                                    } else if (theFieldDefinition.type === "datetime") {
                                        theComponent = <>
                                            <DateTimePicker
                                                defaultValue={field[el]}
                                                disabled={!(theFieldDefinition?.allow?.update || false) || entityStore.isLoading}
                                                onChange={e => this.setState({ field: { ...field, [el]: e } })} />
                                        </>
                                    } else {
                                        theComponent = <Input
                                            type={theFieldDefinition.type}
                                            defaultValue={field[el]}
                                            disabled={!(theFieldDefinition?.allow?.update || false) || entityStore.isLoading}
                                            onChange={e => this.setState({ field: { ...field, [el]: e.target.value } })} />
                                    }

                                    return <FormGroup key={"form-" + id}>
                                        <Label>{fields[el].name || el}</Label>
                                        {theComponent}
                                    </FormGroup>
                                })}

                                <FormGroup className="pt-4">
                                    <Button type="submit" color="primary" size="lg">Save</Button>
                                    <When condition={match.params.id !== "new"}>
                                        <Button type="button" color="danger" onClick={(e) => this.handleDeleteRequest(e)} className="ml-4">Delete</Button>
                                    </When>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>
                <EntityDeletor
                    entityRules={entityRules}
                    onDeleteCanceled={() => this.setState({ itemToDelete: undefined })}
                    onDeleteSucceed={(e) => this.handleDeleteSucceed(e)}
                    item={itemToDelete}
                />
            </div >
        )
    }

    handleDeleteSucceed() {
        const { history, entityStore, entityName, entityRules } = this.props;
        this.setState({ itemToDelete: undefined })
        entityStore.fetch(entityRules.apiPath)
        history.push("/admin/manage/" + entityName)
    }

    handleDeleteRequest() {
        const { entityStore } = this.props;
        this.setState({ itemToDelete: entityStore.item })
    }
}

export default withRouter(inject("entityStore")(observer(EntityEditor)));
