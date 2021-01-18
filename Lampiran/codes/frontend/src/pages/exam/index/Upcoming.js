import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { When } from 'react-if';
import Table from "reactstrap/lib/Table";


const Upcoming = ({ participant }) => {
  const { exam = {}, computer = {}, username } = participant;
  return (
    <>
      <div className="p-4">
        <h3>{exam.uts ? "Ujian Tengah Semester" : "Ujian Akhir Semester"}{exam.shift ? " Shift " + exam.shift : ""}</h3>
        <p className="lead">Hai <b className="text-info">{username}</b>, berikut detil ujianmu sesi ini:</p>
        <Table>
          <tbody>
            <tr>
              <th>Mata Kuliah</th>
              <td>
                {exam.lecture?.lecture_code} <br />
                <span className="text-muted">{exam.lecture?.name}</span>
              </td>
            </tr>
            <When condition={exam.shift !== null && exam.shift !== 0}>
              <tr>
                <th>Shift</th>
                <td>
                  {exam.shift}
                </td>
              </tr>
            </When>
            <tr>
              <th>Durasi</th>
              <td>
                {exam.time_duration / 60} Menit
              </td>
            </tr>
            <tr>
              <th>Nomor Kursi / Komputer</th>
              <td>
                {computer.name}
              </td>
            </tr>
          </tbody>
        </Table>

        <p>
          Ujian dapat dimulai saat dosen pengawas telah menekan tombol mulai pada komputer dosen.
          Kontak dosen pengawas jika terdapat masalah atau kesalahan informasi ujian.
        </p>
      </div>
    </>
  )
}
Upcoming.propTypes = {
  participant: PropTypes.object.isRequired
}

export default (observer(Upcoming));