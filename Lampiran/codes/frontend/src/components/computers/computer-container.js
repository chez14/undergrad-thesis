import React from 'react'
import { Col, Row } from 'reactstrap'
import Computer from './computer'
import { observer } from 'mobx-react';

function ComputersContainer({ computers = [], editable = true, onComputerClick = () => { } }) {

    // PROCCESSOR
    let rows = {};
    computers.map(comp => {
        if (!rows[comp.d_pos.y]) {
            rows[comp.d_pos.y] = [];
        }
        rows[comp.d_pos.y].push(comp);
        return rows;
    })

    // reurut:
    let comp = Object.values(rows).sort((a, b) => (a[0].d_pos.y - b[0].d_pos.y)).map((el) => el.sort((a, b) => (a.d_pos.x - b.d_pos.x)));
    return (
        <>
            {comp.map((el, i) => <Row key={i}>
                {el.map((com, c, arr) => {
                    let offset = 0;

                    if (c === 0 && com.d_pos.x > 1) {
                        offset = com.d_pos.x - 1;
                    } else if (c > 0 && com.d_pos.x - arr[c - 1].d_pos.x !== 1) {
                        offset = com.d_pos.x - arr[c - 1].d_pos.x - 1;
                    }

                    return <Col xs={{ size: 2, offset: (offset * 2) }} key={c}>
                        <Computer
                            setting={com}
                            selectable={editable}
                            selected={!!com.selected}
                            onClick={() => onComputerClick(com)}
                        />
                    </Col>
                })}
            </Row>)}
        </>
    )
}

export default observer(ComputersContainer);
