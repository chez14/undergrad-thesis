import React from 'react'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'

function Step4({ examDetails }) {
    return (
        <div className="my-5">
            <h3>Finish.</h3>
            <p>Examination has been created and participants has been plotted to designated seat.</p>

            <div className="mt-4">
                <Button tag={Link} to={`/admin/exam/${examDetails.exam._id}/detail`}>See Exam</Button>
            </div>
        </div>
    )
}

export default Step4
