import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Table, Nav, NavItem, TabContent, TabPane, Badge, Col, Row, NavLink } from 'reactstrap'
import { If, Then, Else } from 'react-if'
import LocationComputerStore from "./LocationComputerStore";
import ComputersContainer from '~/components/computers/computer-container'
import { axios } from '~/apicall';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fileDownload from 'js-file-download';
import { useAdminStore } from '~/components/use-store';

let locationComputer = new LocationComputerStore();

function AdminExamMigrator({ isOpen = false, onUpdated = () => { }, participants = [], onCloseRequested = () => { } }) {

    const [showAddDialog, setShowAddDialog] = useState(false)
    const [selectedParticipant, setSelectedParticipant] = useState({})
    const [participantFinder, setParticipantFinder] = useState("")
    const [finalMigrtationScript, setFinalMigrtationScript] = useState(undefined);
    const [scriptDownloaded, setScriptDownloaded] = useState(false)

    const [migrationCanidates, setMigrationCanidates] = useState([]);

    const [computerList, setComputerList] = useState({})

    const adminStore = useAdminStore();

    let participantFiltered = participants.filter((par) =>
        participantFinder.length === 0 ||
        (par.username || "").includes(participantFinder) ||
        (par.name || "").includes(participantFinder) ||
        (par.npm || "").includes(participantFinder) ||
        ((par.computer || {}).name || "").includes(participantFinder)
    );

    const [selectedLocations, setSelectedLocations] = useState(0)

    useEffect(() => {
        axios.get("manage/location").then(data => {
            locationComputer.locationComputer = (data.data.data);

            let komp = {};
            data.data.data.forEach(element => {
                element.computers.forEach(comp => {
                    komp[comp._id] = comp;
                })
            });
            setComputerList(komp);
        })
        return () => { };
    }, []);

    function handleAddMigrator(comp) {
        setMigrationCanidates([...migrationCanidates, {
            participant: selectedParticipant,
            to: comp._id
        }])

        setSelectedParticipant({})
        setParticipantFinder("")
        setShowAddDialog(false)
    }

    function handleScriptGenerationRequest() {
        axios.post("manage/exam/" + adminStore.exam._id + "/move", {
            lists: migrationCanidates.map((data) => ({ participant: data.participant._id, to: data.to }))
        }, {
            responseType: 'blob'
        }).then((response) => {
            setShowAddDialog(false)
            setFinalMigrtationScript({
                data: response.data,
                filename: response.headers['x-filename']
            })
            setMigrationCanidates([])
        })
    }

    function handleScriptDownloadSimulate() {
        setScriptDownloaded(true);
        fileDownload(finalMigrtationScript.data, finalMigrtationScript.filename);
    }
    return (
        <>
            <Modal isOpen={isOpen} size="lg" backdrop>
                <ModalHeader>Migrator</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <Button onClick={() => setShowAddDialog(true)}><FontAwesomeIcon icon={faPlus} /> Tambah</Button>
                        </Col>
                    </Row>
                    <Table bordered striped>
                        <thead>
                            <tr>
                                <th>Peserta</th>
                                <th>Komputer Asal</th>
                                <th>Komputer Tujuan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {migrationCanidates.map((data, i) => <tr key={"migration-" + i}>
                                <td>{data.participant.name} - {data.participant.npm}</td>
                                <td>{(computerList[data.participant.computer] || {}).name}</td>
                                <td>{(computerList[data.to] || {}).name}</td>
                            </tr>)}
                        </tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => {
                        setMigrationCanidates([]);
                        onCloseRequested()
                    }}>Batal</Button>
                    <Button color="primary" onClick={handleScriptGenerationRequest}>Pindah dan Buat Script</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={showAddDialog} size="xl">
                <ModalHeader>Tambahkan Peserta</ModalHeader>
                <ModalBody>
                    <If condition={!selectedParticipant || !selectedParticipant._id}>
                        <Then>
                            <FormGroup>
                                <Label>Cari Peserta</Label>
                                <Input type="text" value={participantFinder} onChange={e => setParticipantFinder(e.target.value)} />
                            </FormGroup>
                            <Table bordered striped>
                                <thead>
                                    <tr>
                                        <th>NPM</th>
                                        <th>Nama</th>
                                        <th>Komputer</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participantFiltered.map((par) => <tr key={"participant-" + par._id}>
                                        <td>{par.npm}</td>
                                        <td>{par.name}</td>
                                        <td>{(computerList[par.computer] || {}).name}</td>
                                        <td><Button color="info" onClick={() => setSelectedParticipant(par)}>Pilih</Button></td>
                                    </tr>)}
                                </tbody>
                            </Table>
                        </Then>
                        <Else>
                            <p>{selectedParticipant.name} ({selectedParticipant.npm}) dari Komputer {(selectedParticipant.computer || {}).name} akan dipindah ke komputer: </p>
                            <Nav tabs>
                                {locationComputer.locationComputer.map((loc, i) => <NavItem key={loc._id}>
                                    <NavLink
                                        className={classNames({ active: selectedLocations === i })}
                                        onClick={() => { setSelectedLocations(i); }}
                                    >
                                        {loc.room_name} <Badge color={(loc.computers || []).filter(e => !!e.selected).length > 0 ? "primary" : "secondary"}>{loc.name_alias}</Badge>
                                    </NavLink>
                                </NavItem>)}
                            </Nav>
                            <TabContent activeTab={selectedLocations}>
                                {locationComputer.locationComputer.map((loc, i) => <TabPane tabId={i} key={i}>
                                    <div className="p-4">
                                        <ComputersContainer computers={(loc.computers) || []} onComputerClick={(com) => handleAddMigrator(com)} />
                                    </div>
                                </TabPane>)}
                            </TabContent>
                        </Else>
                    </If>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => {
                        setShowAddDialog(false)
                        setSelectedParticipant({})
                        setParticipantFinder("")
                    }}>Batalkan</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={!!finalMigrtationScript}>
                <ModalHeader>Unduh Script</ModalHeader>
                <ModalBody>
                    <p>Mohon pastikan anda mengunduh script ini karna perpindahan telah dilakukan pada database dan perubahan dibuat permanen.</p>
                    <div className="text-center"><Button color="info" onClick={handleScriptDownloadSimulate}>Unduh Script</Button></div>
                </ModalBody>
                <ModalFooter>
                    <Button color="warning" disabled={!scriptDownloaded} onClick={() => {
                        setScriptDownloaded(false)
                        setFinalMigrtationScript(undefined)
                        onCloseRequested()
                    }}>Tutup</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default observer(AdminExamMigrator)
