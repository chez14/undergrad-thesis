import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { Form, FormGroup, Input, Row, Col, Label, Alert, Button, ButtonGroup, InputGroup, InputGroupAddon } from 'reactstrap';
import DateTimePicker from '~/components/date-time-picker/date-time-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { axios } from '~/apicall';
import moment from "moment";
import "moment/locale/id";

moment.locale('id');

const quickPick = [
    120,
    110,
    105
]

function Step1({ examDetails, onRequestNext }) {

    const [lectures, setLectures] = useState([]);

    const [tipeUjian, setTipeUjian] = useState(1)
    const [mataKuliah, setMataKuliah] = useState(-1)
    const [shift, setShift] = useState(0)
    const [timeStart, setTimeStart] = useState(moment())
    const [duration, setDuration] = useState(7200)
    const [peserta, setPeserta] = useState("")

    useEffect(() => {
        if (examDetails.uts) {
            setTipeUjian(examDetails.uts);
        }

        if (examDetails.lecture) {
            setMataKuliah(examDetails.lecture)
        }

        if (examDetails.shift) {
            setShift(examDetails.shift)
        }

        if (examDetails.timeStart) {
            setTimeStart(moment(examDetails.timeStart))
        }

        if (examDetails.duration) {
            setDuration(examDetails.duration)
        }

        if (examDetails.peserta) {
            setPeserta((examDetails.peserta || []).join("\n"));
        }

        return () => { };
    }, [examDetails]);

    useEffect(() => {
        axios.get("manage/lecture").then(data => {
            setLectures(data.data.data);
        })
        return () => { };
    }, [])

    function handleSubmission(e) {
        e.preventDefault();
        let examDetails = {
            uts: tipeUjian,
            lecture: mataKuliah,
            // eslint-disable-next-line
            lecture_obj: lectures.filter(e => e._id == mataKuliah)[0],
            shift: shift,
            timeStart: timeStart.format("YYYY-MM-DD HH:mm:ss"),
            duration: duration,

            peserta: peserta
                .split(/(\n)/)
                // clean up
                .map(e => e.replace(/\s+/, ""))
                .filter(e => e.length > 0)
        };

        onRequestNext(examDetails);
    }

    function handlePesertaFileUpload(e) {
        let file = (e.target.files || [])[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = (event) => {
                setPeserta(event.target.result);
            }
            reader.readAsText(file);
        }
    }

    return (
        <div className="py-5">
            <Form className="w-100" onSubmit={handleSubmission}>
                <Row>
                    <Col md={2}>
                        <FormGroup>
                            <Label>Tipe Ujian</Label>
                            <Input type="select" name="tipe_ujian" value={tipeUjian} onChange={e => setTipeUjian(e.target.value)}>
                                <option value={1}>UTS</option>
                                <option value={0}>UAS</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label>Mata Kuliah</Label>
                            <Input type="select" name="mata_kuliah" disabled={!lectures} value={mataKuliah} onChange={e => setMataKuliah(e.target.value)}>
                                <option value={-1} disabled>-- {lectures.length > 0 ? "Pilih Mata Kuliah" : "Memuat..."} --</option>
                                {lectures.map(data => <option value={data._id} key={data._id}>{data.lecture_code} - {data.name}</option>)}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label>Shift Ujian</Label>
                            <Input type="select" name="shift" value={shift} onChange={e => setShift(e.target.value)}>
                                <option value={0}>Tidak ada shift</option>
                                <option value={1}>Shift 1</option>
                                <option value={2}>Shift 2</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label>Mulai pada</Label>
                            <DateTimePicker time={timeStart} onChange={setTimeStart} />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label>Selama</Label>
                            <InputGroup>
                                <Input type="number" name="duration" value={duration / 60} onChange={e => setDuration(e.target.value * 60)} />
                                <InputGroupAddon addonType="append">Mnt</InputGroupAddon>
                            </InputGroup>

                            <p className="m-0">Quick Pick:</p>
                            <ButtonGroup>
                                {quickPick.map((el, i) => <Button onClick={e => setDuration(el * 60)} key={i}>{el} Mnt</Button>)}
                            </ButtonGroup>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={8}>
                        <FormGroup>
                            <Label>Peserta</Label>
                            <Input type="textarea" rows={15} value={peserta} onChange={(e) => setPeserta(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Label>atau, Unggah Berkas Daftar Peserta?</Label>
                            <Input type="file" accept="text/plain" onChange={handlePesertaFileUpload} />
                        </FormGroup>
                    </Col>
                    <Col>
                        <Alert color="info">
                            <h3>Peserta</h3>
                            <p>
                                NPM standar 1955 (20xx7α0yyy) dan NPM standar 2018 (6ααxx01yyy) dapat digunakan. Aplikasi akan otomatis melakukan abstraksi terhadap absensi tersebut dan
                                melakukan transformasi ke username standar lab.
                            </p>
                            <p>
                                Informasi lebih lanjut, Anda dapat merujuk pada berkas <a href="https://gitlab.com/ftis-admin/oxam/blob/master/backend%2Fapp%2Fcontroller%2Fapi%2Fmanage%2Fexam.php" target="_blank" rel="noopener noreferrer">controller/api/manage/exam.php</a>.
                            </p>
                        </Alert>
                        <p>
                            Total Peserta: {(peserta.split(/\n/) || []).filter(e => e.length > 0).length} jiwa.
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="text-right mt-5">
                            <Button color="primary" size="lg" type="submit">Seat Plotting <FontAwesomeIcon icon={faChevronRight} /></Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default observer(Step1);
