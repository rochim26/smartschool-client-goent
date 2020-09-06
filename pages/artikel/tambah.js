import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import Input from "../../components/Input";
import MarkdownEditor from "../../components/MarkdownEditor";
import { schoolId, CLIENT_AXIOS } from "../../client/clientAxios";
import swal from "sweetalert";

const tambah = () => {
  const initialState = {
    imgUpload: "",
    img: "",
    title: "",
    summary: "",
    content: "",
    major_id: "",
    status: "",
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
    if (e.target.id == "img") {
      setFormInput({
        ...formInput,
        imgUpload: e.target.files[0],
        img: e.target.value,
      });
    } else {
      setFormInput({ ...formInput, [e.target.id]: e.target.value });
    }
  };

  const handleMarkdown = ({ text }) => {
    setFormInput({ ...formInput, content: text });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("major_id", formInput.major_id);
    data.append("title", formInput.title);
    data.append("summary", formInput.summary);
    data.append("content", formInput.content);
    data.append("img", formInput.imgUpload);
    data.append("status", formInput.status);

    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.post("/blogs", data, {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    }).catch((err) => console.log(err.response));

    if (res) {
      swal("Berhasil!", "Karyamu berhasil tersimpan", "success");
    }
  };
  return (
    <Layout>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/artikel">
              <a>
                <i className="fas fa-chevron-left mr-2"></i>Kembali
              </a>
            </Link>
          </li>
        </ol>
      </nav>

      <div className="card shadow">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Tambah Kehidupan Sekolah
          </h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <Input
              id="title"
              value={formInput.title}
              onChange={handleChange}
              label="Judul"
            />
            <div class="form-group">
              <label for="major_id">Kategori Artikel</label>
              <select
                class="form-control"
                id="major_id"
                onChange={(e) => handleChange(e)}
                value={formInput.major_id}
              >
                <option value="">----Pilih Kategori----</option>
                {listMajor.length ? (
                  listMajor.map((major) => {
                    return (
                      <option key={major.id} value={major.id}>
                        {major.abbr}
                      </option>
                    );
                  })
                ) : (
                  <option value="">----Pilih Kategori----</option>
                )}
              </select>
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select
                class="form-control"
                id="status"
                onChange={(e) => handleChange(e)}
                value={formInput.status}
              >
                <option value="">----Pilih Status----</option>
                <option value="0">Sembunyikan</option>
                <option value="1">Publik</option>
                <option value="2">Internal</option>
              </select>
            </div>
            <Input
              onChange={handleChange}
              id="img"
              value={formInput.img}
              type="file"
              label="Gambar"
            />
            <div className="form-group">
              <label htmlFor="summary">Kesimpulan</label>
              <textarea
                className="form-control"
                id="summary"
                rows="3"
                value={formInput.summary}
                onChange={(e) => handleChange(e)}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Isi Konten</label>
              <MarkdownEditor
                onChange={handleMarkdown}
                value={formInput.content}
              />
            </div>
            <button className="btn btn-primary">Simpan</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default tambah;
