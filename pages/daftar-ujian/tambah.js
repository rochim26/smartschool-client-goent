import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import Input from "../../components/Input";
import MarkdownEditor from "../../components/MarkdownEditor";
import { schoolId, CLIENT_AXIOS } from "../../client/clientAxios";
import swal from "sweetalert";
import { useRouter } from "next/router";

const tambah = () => {
  const router = useRouter();

  const initialState = {
    title: "",
    pg_limit: "",
    essay_limit: "",
    duration: "",
    gmeet: "",
    type: "",
  };

  const [listMajor, setListMajor] = useState([]);

  const fetchMajor = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get(`/majors`, {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    });

    setListMajor(res.data);
  };

  useEffect(() => {
    fetchMajor();
  }, []);

  const [formInput, setFormInput] = useState(initialState);

  const handleChange = (e) => {
    setFormInput({ ...formInput, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formInput.title);
    data.append("pg_limit", formInput.pg_limit);
    data.append("essay_limit", formInput.essay_limit);
    data.append("duration", formInput.duration);
    data.append("gmeet", formInput.gmeet);
    data.append("type", formInput.type);

    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.post("/teachers/exams", data, {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    }).catch((err) => console.log(err.response));

    if (res) {
      swal("Berhasil!", "Ujian berhasil tersimpan", "success");
      router.push("/daftar-ujian");
    }
  };
  return (
    <Layout>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/daftar-ujian">
              <a>
                <i className="fas fa-chevron-left mr-2"></i>Kembali
              </a>
            </Link>
          </li>
        </ol>
      </nav>

      <div className="card shadow">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Tambah Ujian</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <Input
              id="title"
              value={formInput.title}
              onChange={handleChange}
              label="Judul"
            />
            <Input
            type="file"
            onChange={(e) => {
              var fr = new FileReader()
              fr.onload = () => {
                e.textContent
              }
            }}
            />
            <div class="form-group">
              <label for="type">Kategori Ujian</label>
              <select
                class="form-control"
                id="type"
                onChange={(e) => handleChange(e)}
                value={formInput.type}
              >
                <option value="">----Pilih Kategori----</option>
                <option value="ujian harian">Ujian Harian</option>
                <option value="penilaian tengah semester 1">
                  Penilaian Tengah Semester 1
                </option>
                <option value="penilaian akhir semester 1">
                  Penilaian Akhir Semester 1
                </option>
                <option value="penilaian tengah semester 2">
                  Penilaian Tengah Semester 2
                </option>
                <option value="penilaian akhir semester 2">
                  Penilaian Akhir Semester 2
                </option>
              </select>
            </div>
            <Input
              id="pg_limit"
              value={formInput.pg_limit}
              onChange={handleChange}
              label="Jumlah Soal PG"
              type="number"
            />
            <Input
              id="essay_limit"
              value={formInput.essay_limit}
              onChange={handleChange}
              label="Jumlah Soal Essay"
              type="number"
            />
            <Input
              id="duration"
              value={formInput.duration}
              onChange={handleChange}
              label="Durasi dalam menit"
              type="number"
            />
            <Input
              id="gmeet"
              value={formInput.gmeet}
              onChange={handleChange}
              label="Link Google Meet"
            />
            <button className="btn btn-primary">Simpan</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default tambah;
