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
    name: "",
    grade: "",
    gmeet: "",
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
    data.append("name", formInput.name);
    data.append("grade", formInput.grade);
    data.append("gmeet", formInput.gmeet);

    let user;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.post("/teachers/subjects", data, {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    }).catch((err) => console.log(err.response));

    if (res) {
      swal("Berhasil!", "Mata Pelajaran berhasil tersimpan", "success");
      router.push("/mata-pelajaran");
    }
  };
  return (
    <Layout>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/mata-pelajaran">
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
              id="name"
              value={formInput.name}
              onChange={handleChange}
              label="Nama Mapel"
            />
            <div class="form-group">
              <label for="grade">Tingkat Mapel</label>
              <select
                class="form-control"
                id="grade"
                onChange={(e) => handleChange(e)}
                value={formInput.grade}
              >
                <option value="">----Pilih Tingkat----</option>
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </select>
            </div>
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
