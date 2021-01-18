import React, { useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import Stepper from "react-stepper-horizontal";
import { When } from 'react-if';
import Step1 from './step-1';
import Step2 from './step-2';
import Step3 from './step-3';
import Step4 from './step-4';


let steps = [
    { title: "Exam Details" },
    { title: "Seat Plotting" },
    { title: "Confirmation" },
    { title: "Finish" },
];
function ExamCreate() {
    const [examDetails, setExamDetails] = useState({});
    const [currentStep, setCurrentStep] = useState(0);


    function handleStep1Confirmation(data) {
        if (data.peserta.length === 0) {
            return alert("Peserta kosong!");
        }
        setExamDetails({ ...examDetails, ...data });
        setCurrentStep(currentStep + 1);
    }
    function handleStep2Confirmation(data) {
        setExamDetails({ ...examDetails, ...{ computers: data } });
        setCurrentStep(currentStep + 1);
    }

    function handleStep3Confirmation(data) {
        setExamDetails({ ...examDetails, ...{ exam: data } });
        setCurrentStep(currentStep + 1);
    }
    return (
        <div>
            <Container>
                <Row>
                    <Col xs="12">
                        <h2 className="my-3">Examination Plotter</h2>

                        <Stepper
                            steps={steps.map((step, i) => ({ ...step, onClick: (e) => setCurrentStep(i) }))}
                            activeStep={currentStep}
                            activeColor="var(--primary)"
                            completeBarColor="var(--info)"
                            completeColor="var(--info)"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <When condition={currentStep === 0}><Step1 onRequestNext={handleStep1Confirmation} examDetails={examDetails} /></When>
                        <When condition={currentStep === 1}><Step2 onRequestNext={handleStep2Confirmation} examDetails={examDetails} /></When>
                        <When condition={currentStep === 2}><Step3 onRequestNext={handleStep3Confirmation} examDetails={examDetails} /></When>
                        <When condition={currentStep === 3}><Step4 examDetails={examDetails} /></When>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ExamCreate
