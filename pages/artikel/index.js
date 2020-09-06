import Layout from "../../components/Layout";
import { CLIENT_AXIOS } from "../../client/clientAxios";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const index = () => {
  const [artikel, setArtikel] = useState([]);

  const fetchArtikel = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get("/blogs", {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    });

    setArtikel(res.data);
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
      swal("Sukses!", "Anda berhasil mengupdate artikel", "success");
      fetchArtikel();
    }
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  return (
    <Layout>
      <h1 className="h3 mb-4 text-gray-800">Halaman Kehidupan Sekolah</h1>
      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Karya
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {artikel.length ? artikel.length : null}
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
                    Publik
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {artikel.length
                      ? artikel.filter((artikel) => artikel.status === 1).length
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
                    Internal
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                        {artikel.length
                          ? artikel.filter((artikel) => artikel.status === 2)
                              .length
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
                    Disembunyikan
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {artikel.length
                      ? artikel.filter((artikel) => artikel.status === 0).length
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
      <Link href="/artikel/tambah">
        <a className="btn btn-primary mb-4 shadow">
          <i className="fas fa-plus mr-2"></i>Tulis artikel
        </a>
      </Link>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Data Artikel</h6>
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
                  <th>Simpulan</th>
                  <th>Konten</th>
                  <th>Publik/Internal</th>
                  <th>Opsi</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>Judul</th>
                  <th>Simpulan</th>
                  <th>Konten</th>
                  <th>Publik/Internal</th>
                  <th>Opsi</th>
                </tr>
              </tfoot>
              <tbody>
                {artikel.map((artikel) => {
                  return (
                    <tr key={artikel.id}>
                      <td>{artikel.title}</td>
                      <td>{artikel.summary}</td>
                      <td>
                        <div className="content-blog">
                          <ReactMarkdown source={artikel.content} />
                        </div>
                      </td>
                      <td>
                        {artikel.status ? (
                          artikel.status == 1 ? (
                            <button className="btn btn-success">
                              <i className="fas fa-eye mr-2"></i>Publik
                            </button>
                          ) : (
                            <button className="btn btn-primary">
                              <i className="fas fa-eye mr-2"></i>Internal
                            </button>
                          )
                        ) : (
                          <button className="btn btn-secondary">
                            <i className="fas fa-eye-slash mr-2"></i>
                            Disembunyikan
                          </button>
                        )}
                      </td>
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
                            <a
                              className="dropdown-item"
                              href="#!"
                              onClick={() => handleStatus(artikel.id, 1)}
                            >
                              Publik
                            </a>
                            <a
                              className="dropdown-item"
                              href="#!"
                              onClick={() => handleStatus(artikel.id, 2)}
                            >
                              Internal
                            </a>
                            <a
                              className="dropdown-item"
                              href="#!"
                              onClick={() => handleStatus(artikel.id, 0)}
                            >
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
