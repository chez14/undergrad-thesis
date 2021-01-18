import React, { useState, useEffect } from 'react'
import ComputersContainer from '~/components/computers/computer-container'
import { axios } from '~/apicall'
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Badge, Button } from 'reactstrap'
import classNames from 'classnames';
import { observer } from 'mobx-react';
import LocationComputerStore from "./LocationComputerStore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
let locationComputer = new LocationComputerStore();

function Step2({ examDetails, onRequestNext }) {
    const [selectedLocations, setSelectedLocations] = useState(0)

    useEffect(() => {
        axios.get("manage/location").then(data => {
            locationComputer.locationComputer = (data.data.data);
        })
        return () => { };
    }, []);

    useEffect(() => {
        locationComputer.locationComputer.map(loc =>
            loc.computers.map(comp => {
                if ((examDetails.computers || []).includes(comp._id)) {
                    comp.selected = true;
                }
                return null;
            })
        )
        return () => { };
    }, [examDetails])

    function handleRequestNext() {
        if (selectedComputerCounts < (examDetails.peserta || []).length) {
            return;
        }

        // get all those selected computers across the rooms.
        let selectedComputers = [];
        locationComputer.locationComputer.map((loc) => loc.computers.map(comp => {
            if (comp.selected) {
                selectedComputers.push(comp._id);
            }
            return null;
        }));

        onRequestNext(selectedComputers);
    }

    let selectedComputerCounts = 0;
    locationComputer.locationComputer.map((loc) => loc.computers.map(comp => {
        if (comp.selected) {
            selectedComputerCounts++;
        }
        return null;
    }))

    return (<>
        <div className="my-5">
            <Nav tabs>
                {locationComputer.locationComputer.map((loc, i) => <NavItem key={loc._id}>
                    <NavLink
                        className={classNames({ active: selectedLocations === i })}
                        onClick={() => { setSelectedLocations(i); }}>
                        {loc.room_name} <Badge color={(loc.computers || []).filter(e => !!e.selected).length > 0 ? "primary" : "secondary"}>{loc.name_alias}</Badge>
                    </NavLink>
                </NavItem>)}
            </Nav>
            <TabContent activeTab={selectedLocations}>
                {locationComputer.locationComputer.map((loc, i) => <TabPane tabId={i} key={i}>
                    <div className="p-4">
                        <ComputersContainer computers={(loc.computers) || []} onComputerClick={(com) => (com.selected = !(com.selected || false))} />
                    </div>
                </TabPane>)}
            </TabContent>
            <div className="my-3">
                <p>
                    Terdapat {(examDetails.peserta || []).length} peserta dan terpilih <b>{selectedComputerCounts} komputer</b> ({Math.round(selectedComputerCounts / (examDetails.peserta || []).length * 100)}%).
                </p>
            </div>
        </div>
        <div>
            <Row>
                <Col>
                    <div className="text-right mb-5">
                        <Button color="primary"
                            size="lg"
                            type="submit"
                            onClick={handleRequestNext}
                            disabled={selectedComputerCounts < (examDetails.peserta || []).length}>
                            Next <FontAwesomeIcon icon={faChevronRight} />
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    </>
    )
}

export default observer(Step2);
