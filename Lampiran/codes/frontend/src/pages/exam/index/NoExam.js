import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from 'react';
import CardBody from "reactstrap/lib/CardBody";


const displayFaces = [
  'meh-rolling-eyes',
  'surprise',
  'meh',
  'grin-tears',
  'dizzy',
  'lemon'
]

let emotnya = Math.floor(Math.random() * displayFaces.length);
const NoExam = () => {
  return (
    <CardBody>
      <div className="p-4">
        <FontAwesomeIcon icon={['far', displayFaces[emotnya]]} size="3x" className="mb-5 text-muted" />
        <h3>Tidak ada ujian yang sedang berjalan.</h3>
        <p>Mohon kontak administrator, jika anda yakin ini sebuah kesalahan.</p>
      </div>
    </CardBody>
  )
}
NoExam.propTypes = {
}

export default NoExam;