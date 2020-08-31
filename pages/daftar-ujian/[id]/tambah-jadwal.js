import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import Link from "next/link";
import Input from "../../../components/Input";
import MarkdownEditor from "../../../components/MarkdownEditor";
import { schoolId, CLIENT_AXIOS } from "../../../client/clientAxios";
import swal from "sweetalert";
import { useRouter } from "next/router";

const tambah = ({ id }) => {
  const router = useRouter();

  const initialState = {
    start_time: "",
    end_time: "",
    classroom_id: "",
  };

  const [classroom, setClassroom] = useState([]);
  const fetchClassroom = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get(`/teachers/classroom`, {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    });

    setClassroom(res.data);
  };

  useEffect(() => {
    fetchClassroom();
  }, []);

  const [formInput, setFormInput] = useState(initialState);

  const handleChange = (e) => {
    setFormInput({ ...formInput, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("start_time", formInput.start_time);
    data.append("end_time", formInput.end_time);
    data.append("classroom_id", formInput.classroom_id);

    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.post(
      `teachers/exams/${id}/create_exam_classroom`,
      data,
      {
        headers: {
          Authorization: `Bearer ${user.access_token.token}`,
        },
      }
    ).catch((err) => console.log(err.response));

    if (res) {
      swal("Berhasil!", "Jadwal berhasil tersimpan", "success");
      router.push("/daftar-ujian/" + id);
    }
  };
  return (
    <Layout>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/daftar-ujian/[id]" as={`/daftar-ujian/${id}`}>
              <a>
                <i className="fas fa-chevron-left mr-2"></i>Kembali
              </a>
            </Link>
          </li>
        </ol>
      </nav>

      <div className="card shadow">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Tambah Jadwal</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <Input
              id="start_time"
              value={formInput.start_time}
              onChange={handleChange}
              label="Dimulai Pada"
              type="datetime-local"
            />
            <Input
              id="end_time"
              value={formInput.end_time}
              onChange={handleChange}
              label="Ditutup Pada"
              type="datetime-local"
            />
            <div class="form-group">
              <label for="classroom_id">Pilih Kelas Mengajar</label>
              <select
                class="form-control"
                id="classroom_id"
                onChange={(e) => handleChange(e)}
                value={formInput.classroom_id}
              >
                <option value="">----Pilih Kelas Mengajar----</option>
                {classroom.length
                  ? classroom.map((classroom) => {
                      return (
                        <option
                          key={classroom.classroom.id}
                          value={classroom.classroom.id}
                        >
                          {classroom.classroom.grade}{" "}
                          {classroom.classroom.major.abbr}{" "}
                          {classroom.classroom.code}
                        </option>
                      );
                    })
                  : null}
              </select>
            </div>
            <button className="btn btn-primary">Simpan</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ query: { id } }) {
  return {
    props: {
      id,
    },
  };
}

export default tambah;
