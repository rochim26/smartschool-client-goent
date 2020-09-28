import Layout from "../../components/Layout";
import { CLIENT_AXIOS } from "../../client/clientAxios";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const index = () => {
  const [ujian, setUjian] = useState([]);

  const fetchArtikel = async () => {
    let user;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get("/teachers/exams", {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    });

    setUjian(res.data);
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  return (
    <Layout>
      <h1 className="h3 mb-4 text-gray-800">Halaman Ujian</h1>
      <Link href="/daftar-ujian/tambah">
        <a className="btn btn-primary mb-4 shadow">
          <i className="fas fa-plus mr-2"></i>Tambah Ujian
        </a>
      </Link>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Data Ujian</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-bordered"
              width="100%"
              cellSpacing="0"
            >
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Tipe</th>
                  <th>Soal PG</th>
                  <th>Soal Essay</th>
                  <th>Durasi</th>
                  <th>Google Meet Link</th>
                  <th>Opsi</th>
                </tr>
              </thead>
              <tbody>
                {ujian.length ? (
                  ujian.map((ujian) => {
                    return (
                      <tr key={ujian.id}>
                        <td>{ujian.title}</td>
                        <td>{ujian.type}</td>
                        <td>{ujian.pg_limit}</td>
                        <td>{ujian.essay_limit}</td>
                        <td>{ujian.duration}</td>
                        <td>{ujian.gmeet}</td>
                        <td>
                          <div className="dropdown">
                            <button
                              className="btn btn-secondary dropdown-toggle"
                              type="button"
                              id="dropdownMenuButton"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              Opsi
                            </button>
                            <div
                              className="dropdown-menu"
                              aria-labelledby="dropdownMenuButton"
                            >
                              <Link
                                href={`/daftar-ujian/[id]`}
                                as={`/daftar-ujian/${ujian.id}`}
                              >
                                <a className="dropdown-item">Detail</a>
                              </Link>
                              <Link
                                href={`/daftar-ujian/[id]`}
                                as={`/daftar-ujian/${ujian.id}`}
                              >
                                <a className="dropdown-item">Edit</a>
                              </Link>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default index;
