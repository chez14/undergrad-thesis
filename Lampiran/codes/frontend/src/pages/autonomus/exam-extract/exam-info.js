import React from 'react'
import { Col, Row, Table } from 'reactstrap'

function ExamExtractorExamInfo({ exam }) {
    return (
        <>
            <Row>
                <Col>
                    <Table bordered striped>
                        <tbody>
                            <tr>
                                <th>Mata Kuliah</th>
                                <td>{exam?.lecture?.name} ({exam?.lecture?.lecture_code})</td>
                            </tr>
                            <tr>
                                <th>Tahun Ajaran</th>
                                <td>{exam?.lecture_period?.period_code}</td>
                            </tr>
                            <tr>
                                <th>Mulai - Berakhir</th>
                                <td>{exam?.time_opened} - {exam?.time_ended}</td>
                            </tr>
                            <tr>
                                <th>Waktu Mulai Pengumpulan</th>
                                <td>{exam?.time_start || "Belum di buka"}</td>
                            </tr>
                            <tr>
                                <th>Durasi</th>
                                <td>{exam?.time_duration / 60} Menit</td>
                            </tr>
                            <tr>
                                <th>Uts/Uas</th>
                                <td>{exam?.uts ? "UTS" : "UAS"}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col>
                    <Table bordered striped>
                        <tbody>
                            <tr>
                                <th>Jumlah Peserta</th>
                                <td>{(exam?.participants || []).length} Orang</td>
                            </tr>
                            <tr>
                                <th>Dibuat pada</th>
                                <td>{exam?.created_on}</td>
                            </tr>
                            <tr>
                                <th>Terakhir diperbaharui</th>
                                <td>{exam?.updated_on}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    )
}

export default ExamExtractorExamInfo
