import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Layout = ({ children }) => {
  const router = useRouter();
  const [userLogin, setUserLogin] = useState(null);

  useEffect(() => {
    try {
      setUserLogin(JSON.parse(localStorage.getItem("user")));
    } catch (err) {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };
  return (
    <div className="page-top">
      {/* <!-- Page Wrapper --> */}
      <div id="wrapper">
        {/* <!-- Sidebar --> */}
        <ul
          className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
          id="accordionSidebar"
        >
          {/* <!-- Sidebar - Brand --> */}
          <Link href="/">
            <a className="sidebar-brand d-flex align-items-center justify-content-center text-white">
              <div className="sidebar-brand-icon">
                <i className="fas fa-school"></i>
              </div>
              <div className="sidebar-brand-text mx-3">Smart School</div>
            </a>
          </Link>

          {/* <!-- Divider --> */}
          <hr className="sidebar-divider my-0" />

          {/* <!-- Nav Item - Dashboard --> */}
          <li className="nav-item">
            <Link href="/">
              <a className="nav-link">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
            </Link>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#artikelMenu"
              aria-expanded="true"
              aria-controls="artikelMenu"
            >
              <i className="fas fa-fw fa-pen"></i>
              <span>Kehidupan Sekolah</span>
            </a>
            <div
              id="artikelMenu"
              className="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <Link href="/artikel/tambah">
                  <a className="collapse-item">Tulis baru</a>
                </Link>
                <Link href="/artikel">
                  <a className="collapse-item">Karyaku</a>
                </Link>
              </div>
            </div>
          </li>

          {userLogin ? (
            userLogin.user?.role == "student" ? (
              <>
                {/* <!-- Divider --> */}
                <hr className="sidebar-divider" />

                {/* <!-- Heading --> */}
                <div className="sidebar-heading">Siswa</div>

                <li className="nav-item">
                  <Link href="/e-learning">
                    <a className="nav-link">
                      <i className="fas fa-fw fa-book"></i>
                      <span>E-Learning</span>
                    </a>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/ujian">
                    <a className="nav-link">
                      <i className="fas fa-fw fa-diagnoses"></i>
                      <span>Ujian</span>
                    </a>
                  </Link>
                </li>
              </>
            ) : null
          ) : null}

          {userLogin ? (
            userLogin.user?.role == "teacher" ? (
              <>
                {/* <!-- Divider --> */}
                <hr className="sidebar-divider" />

                {/* <!-- Heading --> */}
                <div className="sidebar-heading">Guru</div>

                {/* <!-- Nav Item - Pages Collapse Menu --> */}
                <li className="nav-item">
                  <a
                    className="nav-link collapsed"
                    href="#"
                    data-toggle="collapse"
                    data-target="#mataPelajaranMenu"
                    aria-expanded="true"
                    aria-controls="mataPelajaranMenu"
                  >
                    <i className="fas fa-fw fa-book"></i>
                    <span>Mata Pelajaran</span>
                  </a>
                  <div
                    id="mataPelajaranMenu"
                    className="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordionSidebar"
                  >
                    <div className="bg-white py-2 collapse-inner rounded">
                      <Link href="/mata-pelajaran/tambah">
                        <a className="collapse-item">Buat Baru</a>
                      </Link>
                      <Link href="/mata-pelajaran">
                        <a className="collapse-item">Lihat Data</a>
                      </Link>
                    </div>
                  </div>
                </li>

                {/* <!-- Nav Item - Pages Collapse Menu --> */}
                <li className="nav-item">
                  <a
                    className="nav-link collapsed"
                    href="#"
                    data-toggle="collapse"
                    data-target="#ujianMenu"
                    aria-expanded="true"
                    aria-controls="ujianMenu"
                  >
                    <i className="fas fa-fw fa-book-open"></i>
                    <span>Ujian</span>
                  </a>
                  <div
                    id="ujianMenu"
                    className="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordionSidebar"
                  >
                    <div className="bg-white py-2 collapse-inner rounded">
                      <Link href="/daftar-ujian/tambah">
                        <a className="collapse-item">Buat Baru</a>
                      </Link>
                      <Link href="/daftar-ujian">
                        <a className="collapse-item">Lihat Data</a>
                      </Link>
                      <Link href="/jadwal-ujian">
                        <a className="collapse-item">Lihat Jadwal</a>
                      </Link>
                    </div>
                  </div>
                </li>
              </>
            ) : null
          ) : null}

          {/* <!-- Divider --> */}
          <hr className="sidebar-divider" />

          {/* <!-- Heading --> */}
          {/* <div className="sidebar-heading">Addons</div> */}

          {/* <!-- Sidebar Toggler (Sidebar) --> */}
          <div className="text-center d-none d-md-inline">
            <button
              className="rounded-circle border-0"
              id="sidebarToggle"
            ></button>
          </div>
        </ul>
        {/* <!-- End of Sidebar --> */}

        {/* <!-- Content Wrapper --> */}
        <div id="content-wrapper" className="d-flex flex-column">
          {/* <!-- Main Content --> */}
          <div id="content">
            {/* <!-- Topbar --> */}
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
              {/* <!-- Sidebar Toggle (Topbar) --> */}
              <button
                id="sidebarToggleTop"
                className="btn btn-link d-md-none rounded-circle mr-3"
              >
                <i className="fa fa-bars"></i>
              </button>

              {/* <!-- Topbar Navbar --> */}
              <ul className="navbar-nav ml-auto">
                {/* <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
                <li className="nav-item dropdown no-arrow d-sm-none">
                  {/* <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="searchDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-search fa-fw"></i>
                  </a> */}
                  {/* <!-- Dropdown - Messages --> */}
                  <div
                    className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                    aria-labelledby="searchDropdown"
                  >
                    <form className="form-inline mr-auto w-100 navbar-search">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control bg-light border-0 small"
                          placeholder="Search for..."
                          aria-label="Search"
                          aria-describedby="basic-addon2"
                        />
                        <div className="input-group-append">
                          <button className="btn btn-primary" type="button">
                            <i className="fas fa-search fa-sm"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </li>

                {/* <!-- Nav Item - Alerts --> */}
                <li className="nav-item dropdown no-arrow mx-1">
                  {/* <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="alertsDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-bell fa-fw"></i>
                    <span className="badge badge-danger badge-counter">3+</span>
                  </a> */}
                  {/* <!-- Dropdown - Alerts --> */}
                  <div
                    className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                    aria-labelledby="alertsDropdown"
                  >
                    <h6 className="dropdown-header">Alerts Center</h6>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="mr-3">
                        <div className="icon-circle bg-primary">
                          <i className="fas fa-file-alt text-white"></i>
                        </div>
                      </div>
                      <div>
                        <div className="small text-gray-500">
                          December 12, 2019
                        </div>
                        <span className="font-weight-bold">
                          A new monthly report is ready to download!
                        </span>
                      </div>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="mr-3">
                        <div className="icon-circle bg-success">
                          <i className="fas fa-donate text-white"></i>
                        </div>
                      </div>
                      <div>
                        <div className="small text-gray-500">
                          December 7, 2019
                        </div>
                        $290.29 has been deposited into your account!
                      </div>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="mr-3">
                        <div className="icon-circle bg-warning">
                          <i className="fas fa-exclamation-triangle text-white"></i>
                        </div>
                      </div>
                      <div>
                        <div className="small text-gray-500">
                          December 2, 2019
                        </div>
                        Spending Alert: We've noticed unusually high spending
                        for your account.
                      </div>
                    </a>
                    <a
                      className="dropdown-item text-center small text-gray-500"
                      href="#"
                    >
                      Show All Alerts
                    </a>
                  </div>
                </li>

                {/* <!-- Nav Item - Messages --> */}
                <li className="nav-item dropdown no-arrow mx-1">
                  {/* <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="messagesDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-envelope fa-fw"></i>
                    <span className="badge badge-danger badge-counter">7</span>
                  </a> */}
                  {/* <!-- Dropdown - Messages --> */}
                  <div
                    className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                    aria-labelledby="messagesDropdown"
                  >
                    <h6 className="dropdown-header">Message Center</h6>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="dropdown-list-image mr-3">
                        <img
                          className="rounded-circle"
                          src="https://source.unsplash.com/fn_BT9fwg_E/60x60"
                          alt=""
                        />
                        <div className="status-indicator bg-success"></div>
                      </div>
                      <div className="font-weight-bold">
                        <div className="text-truncate">
                          Hi there! I am wondering if you can help me with a
                          problem I've been having.
                        </div>
                        <div className="small text-gray-500">
                          Emily Fowler · 58m
                        </div>
                      </div>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="dropdown-list-image mr-3">
                        <img
                          className="rounded-circle"
                          src="https://source.unsplash.com/AU4VPcFN4LE/60x60"
                          alt=""
                        />
                        <div className="status-indicator"></div>
                      </div>
                      <div>
                        <div className="text-truncate">
                          I have the photos that you ordered last month, how
                          would you like them sent to you?
                        </div>
                        <div className="small text-gray-500">Jae Chun · 1d</div>
                      </div>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="dropdown-list-image mr-3">
                        <img
                          className="rounded-circle"
                          src="https://source.unsplash.com/CS2uCrpNzJY/60x60"
                          alt=""
                        />
                        <div className="status-indicator bg-warning"></div>
                      </div>
                      <div>
                        <div className="text-truncate">
                          Last month's report looks great, I am very happy with
                          the progress so far, keep up the good work!
                        </div>
                        <div className="small text-gray-500">
                          Morgan Alvarez · 2d
                        </div>
                      </div>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="dropdown-list-image mr-3">
                        <img
                          className="rounded-circle"
                          src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                          alt=""
                        />
                        <div className="status-indicator bg-success"></div>
                      </div>
                      <div>
                        <div className="text-truncate">
                          Am I a good boy? The reason I ask is because someone
                          told me that people say this to all dogs, even if they
                          aren't good...
                        </div>
                        <div className="small text-gray-500">
                          Chicken the Dog · 2w
                        </div>
                      </div>
                    </a>
                    <a
                      className="dropdown-item text-center small text-gray-500"
                      href="#"
                    >
                      Read More Messages
                    </a>
                  </div>
                </li>

                <div className="topbar-divider d-none d-sm-block"></div>

                {/* <!-- Nav Item - User Information --> */}
                <li className="nav-item dropdown no-arrow">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                      {userLogin ? userLogin.user?.name : null}
                    </span>
                    <img
                      className="img-profile rounded-circle"
                      src="https://source.unsplash.com/QAB-WJcbgJk/60x60"
                    />
                  </a>
                  {/* <!-- Dropdown - User Information --> */}
                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                    aria-labelledby="userDropdown"
                  >
                    {/* <a className="dropdown-item" href="#">
                      <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                      Profile
                    </a>
                    <a className="dropdown-item" href="#">
                      <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                      Settings
                    </a> */}
                    <Link href="/profil">
                      <a className="dropdown-item">
                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Profil
                      </a>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-toggle="modal"
                      data-target="#logoutModal"
                    >
                      <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                      Logout
                    </a>
                  </div>
                </li>
              </ul>
            </nav>
            {/* <!-- End of Topbar --> */}

            {/* <!-- Begin Page Content --> */}
            <div className="container-fluid">
              {/* <!-- Page Heading --> */}
              {children}
            </div>
            {/* <!-- /.container-fluid --> */}
          </div>
          {/* <!-- End of Main Content --> */}

          {/* <!-- Footer --> */}
          <footer className="sticky-footer bg-white">
            <div className="container my-auto">
              <div className="copyright text-center my-auto">
                <span>
                  Copyright &copy; SMKN 26 Jakarta. Powered by GoEnt Smart
                  School.
                </span>
              </div>
            </div>
          </footer>
          {/* <!-- End of Footer --> */}
        </div>
        {/* <!-- End of Content Wrapper --> */}
      </div>
      {/* <!-- End of Page Wrapper --> */}

      {/* <!-- Logout Modal--> */}
      <div
        className="modal fade"
        id="logoutModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Yakin ingin keluar?
              </h5>
              <button
                className="close"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              Pilih "Logout" untuk keluar dari aplikasi
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleLogout}
                data-dismiss="modal"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
