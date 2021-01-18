import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Else, If, Then, When } from 'react-if';
import { Alert, Button, Col, Container, Row, Spinner } from 'reactstrap';
import { axios } from '~/apicall';
import Buildinfo from '~/components/buildinfo/Buildinfo';
import AutonomusNavbar from '../components/navbar';
import ExamExtractorExamInfo from './exam-info';

function ExamExtractIndex({ match }) {
    const [isLoading, setIsLoading] = useState(true)
    const [examInfo, setExamInfo] = useState(undefined)
    const [hasError, setHasError] = useState(undefined)

    useEffect(() => {
        axios.post("autonomus/examdownload", { token: match.params.token }).then((resp) => {
            if (resp.data.status) {
                setExamInfo(resp.data.data);
            } else {
                setHasError({ title: resp.error.title, description: resp.error.description })
            }
        }).catch(error => {
            if (error.response === undefined) {
                setHasError({ title: "Network Error", description: "There's error with the network. Please recheck your connection." })
                return;
            } else {
                let errorData = error.response.data;
                setHasError({ title: errorData.error.title, description: errorData.error.description })
                return;
            }
        }).finally(() => {
            setIsLoading(false);
        });

        return () => { }
    }, [match])

    return (
        <>
            <AutonomusNavbar />
            <Container className="my-5" style={({ minHeight: "70vh" })}>
                <Row>
                    <Col>
                        <h3>Exam Answer Downloader</h3>
                    </Col>
                </Row>
                <When condition={isLoading}>
                    <Alert color="dark" className="text-center py-4">
                        <Spinner />
                        <p className="pt-4">Mengontak Server...</p>
                    </Alert>
                </When>
                <If condition={!!hasError}>
                    <Then>
                        <Row>
                            <Col xs={12} md={8}>
                                <Alert color="danger">
                                    <b>{hasError?.title}</b> <br />
                                    {hasError?.description}
                                </Alert>
                            </Col>
                        </Row>
                    </Then>
                    <Else>
                        <ExamExtractorExamInfo exam={examInfo?.exam || {}} />

                        <div className="my-4">
                            <Button href={examInfo?.downloadToken} color="success" size="lg" target="_blank">
                                <FontAwesomeIcon icon={faFileDownload} /> Unduh Jawaban
                            </Button>
                        </div>
                    </Else>
                </If>
            </Container>
            <Container className="my-5">
                <footer className="text-muted">
                    <Row>
                        <Col>
                            <Buildinfo />
                        </Col>
                    </Row>
                </footer>
            </Container>
        </>
    )
}

export default ExamExtractIndex
