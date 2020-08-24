import Layout from "../../components/Layout";
import { CLIENT_AXIOS } from "../../client/clientAxios";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const index = () => {
  const [subjects, setSubjects] = useState([]);

  const fetchArtikel = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get("/teachers/subjects", {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    });

    console.log(res.data);

    setSubjects(res.data);
  };

  const handleStatus = async (id, status) => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.put(
      `/blogs/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${user.access_token.token}`,
        },
      }
    );

    if (res) {
      swal("Sukses!", "Anda berhasil mengupdate subjects", "success");
      fetchArtikel();
    }
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  return (
    <Layout>
      <h1 className="h3 mb-4 text-gray-800">Halaman Mata Pelajaran</h1>
      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Mata Pelajaran
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {subjects.length ? subjects.length : null}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-pen fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Kelas X
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {subjects.length
                      ? subjects.filter((subjects) => subjects.grade === "X")
                          .length
                      : null}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Kelas XI
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                        {subjects.length
                          ? subjects.filter(
                              (subjects) => subjects.grade === "XI"
                            ).length
                          : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Kelas XII
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {subjects.length
                      ? subjects.filter((subjects) => subjects.grade === "XII")
                          .length
                      : null}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-comments fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Link href="/subjects/tambah">
        <a className="btn btn-primary mb-4 shadow">
          <i className="fas fa-plus mr-2"></i>Tambah Baru
        </a>
      </Link>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Data Mata Pelajaran
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
                  <th>Kelas</th>
                  <th>Tatap Muka</th>
                  <th>Opsi</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>Nama</th>
                  <th>Kelas</th>
                  <th>Tatap Muka</th>
                  <th>Opsi</th>
                </tr>
              </tfoot>
              <tbody>
                {subjects.map((subject) => {
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default index;
