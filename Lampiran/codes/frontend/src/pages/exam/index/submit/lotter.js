import React, { useCallback, useState, useEffect } from 'react'
import { Progress, Modal, ModalBody, ModalFooter, Button, UncontrolledTooltip } from 'reactstrap'
import { If, Then, Else } from 'react-if'
import { useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createUseStyles } from 'react-jss'
import { axios } from '~/apicall'
import { faCloudDownloadAlt, faSync } from '@fortawesome/free-solid-svg-icons'
import fileDownload from 'js-file-download'

const useStyles = createUseStyles(({
    root: {
        cursor: "pointer"
    }
}))

const reaction = [
    "(~‾▿‾)~",
    "(ง •̀_•́)ง",
    "ฅ^•ﻌ•^ฅ #cats",
    "ʕ•ᴥ•ʔ #bears",
    "༼ つ ◕_◕ ༽つ gib",
    "(๑ↀᆺↀ๑)✧ #cats",
    "OwO",
    "(づ｡◕‿‿◕｡)づ"
]

let emotnya = reaction[Math.floor(Math.random() * reaction.length)];

function Lotter({ answer_slot }) {
    const [uploading, setUploading] = useState(0);
    const [progress, setProgress] = useState(false);
    const [fetchingSubmission, setFetchingSubmission] = useState(true)
    const [submission, setSubmission] = useState(null);

    const [capturedMismatchFile, setCapturedMismatchFile] = useState(null)

    const [errorModal, setErrorModal] = useState(null)

    // Real upload callback.
    const triggerUpload = useCallback((acceptedFile) => {
        setProgress(true);
        let data = new FormData()
        data.append('file', acceptedFile, answer_slot.format)
        data.append('answer_slot', answer_slot._id)

        axios.post("exam/submission/submit", data, {
            onUploadProgress: (progressEvent) => {
                setUploading(progressEvent.loaded / progressEvent.total);
            }
        }).then((resp) => {
            setProgress(false);
            setSubmission(resp.data.data);
            // TODO: Pesan sukses
        }).catch((resp) => {
            setProgress(false);
            if (resp.response.data && resp.response.data.error) {
                setErrorModal(<>
                    <h5>{resp.response.data.error.title} [{resp.response.data.error.error_code}]</h5>
                    <p>{resp.response.data.error.description}</p>
                </>)
            } else {
                console.error(resp);
                console.log(JSON.stringify(resp));
                setErrorModal(<>
                    <h5>Error happened</h5>
                    <p>{resp.message}</p>
                    <p><small>Because it's a browser(/network) related error, the error has been emitted to the console.</small></p>
                </>)
            }
        })
    }, [answer_slot])

    // drop handler
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles[0].name !== answer_slot.format) {
            setCapturedMismatchFile(acceptedFiles[0]);
        } else {
            triggerUpload(acceptedFiles[0]);
        }
    }, [answer_slot, triggerUpload])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    const styles = useStyles();

    // hooks for fetching submission
    useEffect(() => {
        setFetchingSubmission(true);
        axios.get("exam/submission/submit", { params: { answer_slot: answer_slot._id } }).then(data => {
            setFetchingSubmission(false);
            setSubmission(data.data.data);
        }).catch((err) => {
            setFetchingSubmission(false);
            setSubmission(null);
            console.error("ERROR HAPPENED:", err);

        })
        return () => { };
    }, [answer_slot])

    // handler for downloading stuffs.
    function handleDownload() {
        axios.get("exam/submission/submit", {
            params: {
                answer_slot: answer_slot._id,
                force_download: true
            },
            responseType: 'blob'
        }).then((resp) => {
            fileDownload(resp.data, answer_slot.format);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <tr>
            <td className="align-middle">
                <Button
                    color={!submission ? "secondary" : "success"}
                    id={"download-button-" + answer_slot._id}
                    onClick={handleDownload}
                    disabled={fetchingSubmission || !submission}
                >
                    <FontAwesomeIcon icon={fetchingSubmission ? faSync : faCloudDownloadAlt} />
                </Button>
                <UncontrolledTooltip placement="bottom" target={"download-button-" + answer_slot._id}>Unduh Berkas</UncontrolledTooltip>
            </td>
            <td className="align-middle">
                <p className={"font-monospace font-weight-bold m-0" + ((!fetchingSubmission && !submission) ? " text-danger" : "")}>{answer_slot.format}</p>
            </td>
            <If condition={progress}>
                <Then>
                    <td className="align-middle">
                        <Progress animated={progress} value={uploading} max={1}>{(uploading * 100 + " %")}</Progress>
                    </td>
                </Then>
                <Else>
                    <td {...getRootProps({ className: (styles.root + " text-right align-middle") })}>
                        <input {...getInputProps({ multiple: false })} />
                        <If condition={isDragActive}>
                            <Then>
                                <span className="text-primary font-weight-bold"><FontAwesomeIcon icon="cloud-upload-alt" /> {emotnya}</span>
                            </Then>
                            <Else>
                                <div>
                                    <FontAwesomeIcon icon="cloud-upload-alt" /> Upload dengan <b>klik di sini</b> atau<br />drag berkasnya ke sini
                                </div>
                            </Else>
                        </If>
                    </td>
                </Else>
            </If>
            <Modal isOpen={!!capturedMismatchFile} backdrop>
                <ModalBody>
                    <p>Anda mengupload file dengan format penamaan yang berbeda.</p>
                    <p>Anda mengupload <code>{(capturedMismatchFile || {}).name}</code>, sedangkan file yang diinginkan adalah <code>{answer_slot.format}</code></p>
                    <p>
                        Apakah anda ingin tetap menguploadnya (namanya bakal digantiin sama kita kok), atau batalkan upload?
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => {
                        triggerUpload(capturedMismatchFile);
                        setCapturedMismatchFile(null)
                    }}>Ganti Nama dan Upload</Button>
                    <Button color="warning" onClick={() => setCapturedMismatchFile(null)}>Batalkan</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={!!errorModal} backdrop>
                <ModalBody>{errorModal}</ModalBody>
                <ModalFooter><Button color="primary" onClick={() => setErrorModal(null)}>Ok</Button></ModalFooter>
            </Modal>
        </tr >
    )
}

export default Lotter
