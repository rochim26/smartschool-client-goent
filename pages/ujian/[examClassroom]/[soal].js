import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CLIENT_AXIOS } from "../../../client/clientAxios";
import Countdown from "react-countdown";
import moment from "moment";
import swal from "sweetalert";
import firebaseApp from "../../../util/firebase";

const InstruksiUjian = ({ examClassroom, soal }) => {
  let user;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    console.log(err);
  }

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

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleClick = async (idx, id) => {
    setCurrentQuestion(idx);
    setCurrentTime(new Date());

    const activityExam = firebaseApp.database().ref("examTake");
    const activityData = {
      user_id: examTake.user_id,
      exam_classroom_id: examTake.exam_classroom_id,
      status: examTake.status,
      exam_score_id: examTake.id,
      activity: new Date().getTime(),
    };

    activityExam.push(activityData);

    router.push(
      `/ujian/[examClassroom]/[soal]`,
      `/ujian/${examClassroom}/${id}`
    );
  };

  const [essay, setEssay] = useState("");
  const [examTake, setExamTake] = useState({});
  const getExamTake = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const r = await CLIENT_AXIOS.post(
      `/students/exam-classroom/${examClassroom}/take`,
      null,
      {
        headers: {
          Authorization: `Bearer ${user ? user.access_token.token : null}`,
        },
      }
    ).catch((err) => console.log(err.response));

    if (r.data.status) {
      setExamTake(r.data);
    } else {
      router.push(
        `/ujian/detail/[examClassroom]/[soal]`,
        `/ujian/detail/${examClassroom}/${soal}`
      );
    }
  };

  const [question, setQuestion] = useState({});
  const getQuestion = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const r = await CLIENT_AXIOS.get(`/students/exam-take-question/${soal}`, {
      headers: {
        Authorization: `Bearer ${user ? user.access_token.token : null}`,
      },
    });

    setQuestion(r.data);
    setEssay(r.data.essay || "");
  };

  const handleAnswer = async (exam_answer_id, id) => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }
    const r = await CLIENT_AXIOS.put(
      `/students/exam-take-answer/${id}/answer`,
      {
        exam_answer_id,
        essay,
        duration: moment(new Date()).diff(moment(currentTime), "seconds"),
      },
      {
        headers: {
          Authorization: `Bearer ${user ? user.access_token.token : null}`,
        },
      }
    ).catch((err) => console.log(err.response));

    if (r.data) {
      swal("Sukses!", r.data.message, "success");

      setEssay("");
    }

    getExamTake();
    getQuestion();
  };

  const timesUp = () => {
    router.push(
      `/ujian/detail/[examClassroom]/[soal]`,
      `/ujian/detail/${examClassroom}/${soal}`
    );
  };

  const handleSubmit = () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    swal({
      title: "Masih ada sisa waktu!",
      text: "Apakah anda yakin ingin menyelesaikan ujian sekarang?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const r = await CLIENT_AXIOS.put(
          `/students/exam-submit/${examTake.id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${user ? user.access_token.token : null}`,
            },
          }
        );

        router.push(
          `/ujian/detail/[examClassroom]/[soal]`,
          `/ujian/detail/${examClassroom}/${soal}`
        );
      }
    });
  };

  const prevQuestion = () => {};

  const nextQuestion = () => {};

  useEffect(() => {
    getExamTake();
    getQuestion();
  }, [soal]);
  return (
    <div>
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
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="searchDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-search fa-fw"></i>
            </a>
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
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="alertsDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-bell fa-fw"></i>
              {/* <!-- Counter - Alerts --> */}
              <span className="badge badge-danger badge-counter">3+</span>
            </a>
            {/* <!-- Dropdown - Alerts --> */}
            <div
              className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
              aria-labelledby="alertsDropdown"
            >
              <h6 className="dropdown-header">Alerts Center</h6>
              <a className="dropdown-item d-flex align-items-center" href="#">
                <div className="mr-3">
                  <div className="icon-circle bg-primary">
                    <i className="fas fa-file-alt text-white"></i>
                  </div>
                </div>
                <div>
                  <div className="small text-gray-500">December 12, 2019</div>
                  <span className="font-weight-bold">
                    A new monthly report is ready to download!
                  </span>
                </div>
              </a>
              <a className="dropdown-item d-flex align-items-center" href="#">
                <div className="mr-3">
                  <div className="icon-circle bg-success">
                    <i className="fas fa-donate text-white"></i>
                  </div>
                </div>
                <div>
                  <div className="small text-gray-500">December 7, 2019</div>
                  $290.29 has been deposited into your account!
                </div>
              </a>
              <a className="dropdown-item d-flex align-items-center" href="#">
                <div className="mr-3">
                  <div className="icon-circle bg-warning">
                    <i className="fas fa-exclamation-triangle text-white"></i>
                  </div>
                </div>
                <div>
                  <div className="small text-gray-500">December 2, 2019</div>
                  Spending Alert: We've noticed unusually high spending for your
                  account.
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
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="messagesDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-envelope fa-fw"></i>
              {/* <!-- Counter - Messages --> */}
              <span className="badge badge-danger badge-counter">7</span>
            </a>
            {/* <!-- Dropdown - Messages --> */}
            <div
              className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
              aria-labelledby="messagesDropdown"
            >
              <h6 className="dropdown-header">Message Center</h6>
              <a className="dropdown-item d-flex align-items-center" href="#">
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
                    Hi there! I am wondering if you can help me with a problem
                    I've been having.
                  </div>
                  <div className="small text-gray-500">Emily Fowler · 58m</div>
                </div>
              </a>
              <a className="dropdown-item d-flex align-items-center" href="#">
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
                    I have the photos that you ordered last month, how would you
                    like them sent to you?
                  </div>
                  <div className="small text-gray-500">Jae Chun · 1d</div>
                </div>
              </a>
              <a className="dropdown-item d-flex align-items-center" href="#">
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
                    Last month's report looks great, I am very happy with the
                    progress so far, keep up the good work!
                  </div>
                  <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                </div>
              </a>
              <a className="dropdown-item d-flex align-items-center" href="#">
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
                    Am I a good boy? The reason I ask is because someone told me
                    that people say this to all dogs, even if they aren't
                    good...
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
                {user ? user.user.name : null}
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
              <a className="dropdown-item" href="#">
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                Profile
              </a>
              <a className="dropdown-item" href="#">
                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                Settings
              </a>
              <a className="dropdown-item" href="#">
                <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                Activity Log
              </a>
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-8">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-secondary btn-sm px-5"
                    onClick={prevQuestion}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  Soal No. {currentQuestion || 1}
                  <button
                    className="btn btn-secondary btn-sm px-5"
                    onClick={nextQuestion}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </h6>
              </div>
              <div className="card-body">
                <h4>
                  {question.examQuestion
                    ? question.examQuestion.question
                    : "Loading..."}
                </h4>
              </div>
            </div>

            {question.is_essay ? (
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Jawab</h6>
                </div>
                <div className="card-body">
                  <div class="form-group">
                    <textarea
                      class="form-control"
                      rows="3"
                      rows="15"
                      placeholder="Tekan simpan jawaban saat selesai menulis"
                      onChange={(e) => setEssay(e.target.value)}
                      value={essay}
                    ></textarea>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAnswer(null, question.id)}
                  >
                    Simpan Jawaban
                  </button>
                </div>
              </div>
            ) : (
              <div className="list-group">
                {question.examQuestion
                  ? question.examQuestion.examAnswers.map((answer, idx) => {
                      return (
                        <button
                          key={answer.id}
                          onClick={(e) => handleAnswer(answer.id, question.id)}
                          class={
                            question.exam_answer_id == answer.id
                              ? "list-group-item list-group-item-action mb-4 border shadow rounded active"
                              : "list-group-item list-group-item-action mb-4 border shadow rounded"
                          }
                        >
                          <div className="row">
                            <span className="col-11 p-3">
                              {idx + 1 == 1 ? "A" : null}{" "}
                              {idx + 1 == 2 ? "B" : null}{" "}
                              {idx + 1 == 3 ? "C" : null}{" "}
                              {idx + 1 == 4 ? "D" : null}{" "}
                              {idx + 1 == 5 ? "E" : null}. {answer.answer}{" "}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  : null}
              </div>
            )}
          </div>
          <div className="col-sm-12 col-md-4">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  Siswa waktu:{" "}
                  <Countdown
                    date={moment(examTake.end_time).format()}
                    onComplete={timesUp}
                  ></Countdown>
                </h6>
              </div>
            </div>
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  Daftar Soal
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  {examTake.examTakes
                    ? examTake.examTakes.map((question, idx) => {
                        return (
                          <div
                            style={{ minWidth: 80 }}
                            className="col-md-3 col-lg-2 mb-3"
                            key={question.id}
                          >
                            <button
                              className={
                                question.exam_answer_id || question.essay
                                  ? "btn btn-primary btn-block"
                                  : "btn btn-secondary btn-block"
                              }
                              key={question.id}
                              onClick={() => handleClick(idx + 1, question.id)}
                            >
                              {idx + 1}
                            </button>
                          </div>
                        );
                      })
                    : null}
                </div>
                <button className="btn btn-danger mt-5" onClick={handleSubmit}>
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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

export async function getServerSideProps({ query: { examClassroom, soal } }) {
  return {
    props: {
      examClassroom,
      soal,
    },
  };
}

export default InstruksiUjian;
