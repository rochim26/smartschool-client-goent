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
    title: "",
    estimation: 0,
    subject_matter: "",
    essay: "",
    video: "",
    videoUpload: "",
  };
  const [formInput, setFormInput] = useState(initialState);

  const [formChange, setFormChange] = useState("materi");

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

  const handleChange = (e) => {
    if (e.target.id == "video") {
      setFormInput({
        ...formInput,
        videoUpload: e.target.files[0],
        video: e.target.value,
      });
    } else {
      setFormInput({ ...formInput, [e.target.id]: e.target.value });
    }
  };

  const handleMarkdown = ({ text }) => {
    setFormInput({ ...formInput, subject_matter: text });
  };

  const handleMarkdownEssay = ({ text }) => {
    setFormInput({ ...formInput, essay: text });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formInput.title);
    data.append("estimation", formInput.estimation);
    data.append("subject_matter", formInput.subject_matter);
    data.append("essay", formInput.essay);
    data.append("video", formInput.videoUpload);

    let user;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.post(
      `/teachers/subjects/${id}/create_subject_matters`,
      data,
      {
        headers: {
          Authorization: `Bearer ${user.access_token.token}`,
        },
      }
    ).catch((err) => console.log(err.response));

    if (res) {
      swal("Berhasil!", "Mata Pelajaran berhasil tersimpan", "success");
      router.push("/mata-pelajaran/[id]", `/mata-pelajaran/${id}`);
    }
  };
  return (
    <Layout>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/mata-pelajaran/[id]" as={`/mata-pelajaran/${id}`}>
              <a>
                <i className="fas fa-chevron-left mr-2"></i>Kembali
              </a>
            </Link>
          </li>
        </ol>
      </nav>

      <div className="card shadow">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Tambah Materi</h6>
        </div>
        <div className="card-body">
          <div className="row text-center">
            <div className="col-md-4">
              <button
                className="btn btn-primary btn-lg rounded-circle"
                onClick={() => setFormChange("materi")}
              >
                <i className="fas fa-edit"></i>
              </button>
              <p>Materi</p>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-info btn-lg rounded-circle"
                onClick={() => setFormChange("tugas")}
              >
                <i className="fas fa-edit"></i>
              </button>
              <p>Tugas</p>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-success btn-lg rounded-circle"
                onClick={() => setFormChange("quiz")}
              >
                <i className="fas fa-edit"></i>
              </button>
              <p>Under maintenance</p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {formChange == "materi" ? (
              <>
                <Input
                  id="title"
                  value={formInput.title}
                  onChange={handleChange}
                  label="Judul"
                />
                <Input
                  id="estimation"
                  value={formInput.estimation}
                  onChange={handleChange}
                  label="Estimasi waktu belajar (dalam menit)"
                  type="number"
                />
                <Input
                  id="video"
                  type="file"
                  value={formInput.video}
                  onChange={handleChange}
                  label="Video (opsional)"
                />
                <div className="form-group">
                  <label>Isi Materi</label>
                  <MarkdownEditor
                    onChange={handleMarkdown}
                    value={formInput.subject_matter}
                  />
                </div>
              </>
            ) : formChange == "quiz" ? (
              "ini quiz"
            ) : (
              <>
                <Input
                  id="title"
                  value={formInput.title}
                  onChange={handleChange}
                  label="Judul"
                />
                <Input
                  id="estimation"
                  value={formInput.estimation}
                  onChange={handleChange}
                  label="Estimasi waktu mengerjakan (dalam menit)"
                  type="number"
                />
                <div className="form-group">
                  <label>Tugas</label>
                  <MarkdownEditor
                    onChange={handleMarkdownEssay}
                    value={formInput.essay}
                  />
                </div>
              </>
            )}
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
