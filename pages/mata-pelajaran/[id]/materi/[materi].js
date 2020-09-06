import Layout from "../../../../components/Layout";
import { CLIENT_AXIOS, BASE_URL } from "../../../../client/clientAxios";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const index = ({ id, materi }) => {
  const [subject, setSubject] = useState({});

  const fetchArtikel = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get(`/teachers/subjects/${id}`, {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    });

    setSubject(res.data);
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  const namaSiswa = [
    "ALDAVA RAMANDA",
    "ROCHIM RAMADHANI CHIEFTO IRAWAN",
    "NAVISHA WILARMAN",
  ];
  const durasiSiswa = [4, 7, 3];

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

      <h1 className="h3 mb-4 text-gray-800">
        {subject.name} Kelas {subject.grade}
      </h1>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Daftar siswa belajar
          </h6>
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
                  <th>Nama</th>
                  <th>Estimasi membaca</th>
                  <th>Durasi membaca</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>Nama</th>
                  <th>Estimasi membaca</th>
                  <th>Durasi membaca</th>
                </tr>
              </tfoot>
              <tbody>
                {subject.subjectMatters
                  ? subject.subjectMatters.map((matters, idx) => {
                      return (
                        <tr key={matters.id}>
                          <td>{namaSiswa[idx]}</td>
                          <td>{matters.estimation} menit</td>
                          <td>{durasiSiswa[idx]} menit</td>
                        </tr>
                      );
                    })
                  : null}
                {/* {subjects.map((subject) => {
                  return (
                    <tr key={subject.id}>
                      <td>{subject.name}</td>
                      <td>{subject.grade}</td>
                      <td>
                        <a
                          className="btn btn-primary"
                          href={subject.gmeet}
                          target="_blank"
                        >
                          Mulai
                        </a>
                      </td>
                      <td>
                        <div className="dropdown">
                          <Link
                            href="/mata-pelajaran/[id]"
                            as={`/mata-pelajaran/${subject.id}`}
                          >
                            <a className="btn btn-info mr-2">Detail</a>
                          </Link>
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
                            <a className="dropdown-item" href="#!">
                              Publik
                            </a>
                            <a className="dropdown-item" href="#!">
                              Internal
                            </a>
                            <a className="dropdown-item" href="#!">
                              Sembunyikan
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ query: { id, materi } }) {
  return {
    props: {
      id,
      materi,
    },
  };
}

export default index;
