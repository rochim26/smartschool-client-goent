import Layout from "../../components/Layout";
import { CLIENT_AXIOS, BASE_URL } from "../../client/clientAxios";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import Link from "next/link";
import Input from "../../components/Input";
import moment from "moment";
import "moment/locale/id";
import MarkdownEditor from "../../components/MarkdownEditor";
import Axios from "axios";
moment.locale("id");

const index = ({ id }) => {
  const [ujian, setUjian] = useState({});
  const [schedule, setSchedule] = useState([]);

  const initialOption = [0, 0, 0, 0, 0];
  const [optionAnswer, setOptionAnswer] = useState(initialOption);

  const initialAnswer = {
    "answer[0]": "",
    "answer[1]": "",
    "answer[2]": "",
    "answer[3]": "",
    "answer[4]": "",
    "is_answer[0]": 0,
    "is_answer[1]": 0,
    "is_answer[2]": 0,
    "is_answer[3]": 0,
    "is_answer[4]": 0,
    is_essay: 0,
    question: "",
    estimation: 0,
    image: "",
    imageUpload: "",
    audio: "",
    audioUpload: "",
  };
  const [answer, setAnswer] = useState(initialAnswer);
  const handleChange = (e) => {
    if (e.target.name == "image") {
      setAnswer({
        ...answer,
        imageUpload: e.target.files[0],
        image: e.target.value,
      });
    } else if (e.target.name == "audio") {
      setAnswer({
        ...answer,
        audioUpload: e.target.files[0],
        audio: e.target.value,
      });
    } else {
      setAnswer({ ...answer, [e.target.name]: e.target.value });
    }
  };

  const handleMakeAnswer = (e, name) => {
    setAnswer({ ...answer, [name]: e.text });
  };

  const handleMakeQuestion = ({ text }) => {
    setAnswer({ ...answer, question: text });
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("question", answer.question);
    data.append("estimation", answer.estimation);
    data.append("is_essay", answer.is_essay);
    data.append("image", answer.imageUpload);
    data.append("audio", answer.audioUpload);
    if (!answer.is_essay) {
      data.append("answer[0]", answer["answer[0]"]);
      data.append("answer[1]", answer["answer[1]"]);
      data.append("answer[2]", answer["answer[2]"]);
      data.append("answer[3]", answer["answer[3]"]);
      data.append("answer[4]", answer["answer[4]"]);
      data.append("is_answer[0]", answer["is_answer[0]"]);
      data.append("is_answer[1]", answer["is_answer[1]"]);
      data.append("is_answer[2]", answer["is_answer[2]"]);
      data.append("is_answer[3]", answer["is_answer[3]"]);
      data.append("is_answer[4]", answer["is_answer[4]"]);
    }

    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.post(
      `/teachers/exams/${id}/questions`,
      data,
      {
        headers: {
          Authorization: `Bearer ${user.access_token.token}`,
        },
      }
    ).catch((err) => console.log(err.response));

    if (res) {
      swal("Berhasil!", "Karyamu berhasil tersimpan", "success");
      fetchDetail();
      setOptionAnswer(initialOption);
      setAnswer(initialAnswer);
    }
  };

  const handleClickOption = (idx) => {
    initialOption[idx] = 1;
    setOptionAnswer([...initialOption]);

    if (idx === 0) {
      setAnswer({
        ...answer,
        "is_answer[0]": 1,
        "is_answer[1]": 0,
        "is_answer[2]": 0,
        "is_answer[3]": 0,
        "is_answer[4]": 0,
      });
    } else if (idx === 1) {
      setAnswer({
        ...answer,
        "is_answer[0]": 0,
        "is_answer[1]": 1,
        "is_answer[2]": 0,
        "is_answer[3]": 0,
        "is_answer[4]": 0,
      });
    } else if (idx === 2) {
      setAnswer({
        ...answer,
        "is_answer[0]": 0,
        "is_answer[1]": 0,
        "is_answer[2]": 1,
        "is_answer[3]": 0,
        "is_answer[4]": 0,
      });
    } else if (idx === 3) {
      setAnswer({
        ...answer,
        "is_answer[0]": 0,
        "is_answer[1]": 0,
        "is_answer[2]": 0,
        "is_answer[3]": 1,
        "is_answer[4]": 0,
      });
    } else if (idx === 4) {
      setAnswer({
        ...answer,
        "is_answer[0]": 0,
        "is_answer[1]": 0,
        "is_answer[2]": 0,
        "is_answer[3]": 0,
        "is_answer[4]": 1,
      });
    }
  };

  const fetchDetail = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get(`/teachers/exams/${id}`, {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    });

    console.log(res.data);

    setUjian(res.data);
  };

  const fetchSchedule = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get(
      `/teachers/exams/${id}/get_exam_classroom`,
      {
        headers: {
          Authorization: `Bearer ${user.access_token.token}`,
        },
      }
    );

    setSchedule(res.data);
  };

  const [stateEditQuestion, setStateEditQuestion] = useState({});
  const getDataForEdit = (id) => {
    const getDetail = ujian?.examQuestions.filter((examQuestion) => {
      return examQuestion.id === id;
    });

    console.log(getDetail[0]);
    setStateEditQuestion(getDetail[0]);
  };

  useEffect(() => {
    fetchDetail();
    fetchSchedule();
  }, []);

  // import
  const [importExcel, setImportExcel] = useState("");
  const [importExcelUpload, setImportExcelUpload] = useState("");
  const handleImportExcel = (e) => {
    setImportExcel(e.target.value);
    setImportExcelUpload(e.target.files[0]);
  };

  const handleImportExcelSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("upload", importExcelUpload);

    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.post(
      `/teachers/exams/${id}/import_question`,
      data,
      {
        headers: {
          Authorization: `Bearer ${user.access_token.token}`,
        },
      }
    ).catch((err) => console.log(err.response));

    if (res) {
      console.log("hasil", res.data);
      swal("Berhasil!", "Soal berhasil tersimpan", "success");
      fetchDetail();
      setImportExcel("");
      setImportExcelUpload("");
    }
  };

  const [currentStateAnswerId, setCurrentStateAnswerId] = useState(0);
  const [currentStateAnswer, setCurrentStateAnswer] = useState("");
  const [stateIsAnswer, setStateIsAnswer] = useState(0);
  const saveUpdateAnswer = async (id) => {
    console.log(currentStateAnswer, stateIsAnswer);

    const data = new FormData();
    if (currentStateAnswer) {
      data.append("answer", currentStateAnswer);
    }
    data.append("is_answer", stateIsAnswer);

    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.put(`/teachers/answer/${id}`, data, {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    }).catch((err) => console.log(err.response));

    if (res) {
      swal("Berhasil!", "Soal berhasil tersimpan", "success");

      fetchDetail();
      fetchSchedule();
      setCurrentStateAnswerId(0);
      setCurrentStateAnswer("");
    }
  };

  return (
    <Layout>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">{ujian.title}</h1>
      </div>

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

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Data Jadwal Ujian
          </h6>
        </div>
        <div className="card-body">
          <Link
            href="/daftar-ujian/[id]/tambah-jadwal"
            as={`/daftar-ujian/${id}/tambah-jadwal`}
          >
            <a className="btn btn-primary mb-4 shadow">
              <i className="fas fa-plus mr-2"></i>Tambah Jadwal
            </a>
          </Link>

          <div className="table-responsive">
            <table
              className="table table-bordered"
              cellSpacing="0"
              width="100%"
            >
              <thead>
                <tr>
                  <th>Kelas</th>
                  <th>Dimulai pada</th>
                  <th>Ditutup pada</th>
                </tr>
              </thead>
              <tbody>
                {schedule.length
                  ? schedule.map((schedule) => {
                      return (
                        <tr>
                          <td>
                            {schedule.classroom.grade}{" "}
                            {schedule.classroom.major.abbr}{" "}
                            {schedule.classroom.code}
                          </td>
                          <td>
                            {moment(schedule.start_time).format(
                              "dddd, Do MMMM YYYY h:mm a"
                            )}
                          </td>
                          <td>
                            {moment(schedule.end_time).format(
                              "dddd, Do MMMM YYYY h:mm a"
                            )}
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Data Ujian</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="table-responsive">
                <table
                  className="table table-bordered"
                  width="100%"
                  cellSpacing="0"
                >
                  <thead>
                    <tr>
                      <th>Soal Pilihan Ganda</th>
                      <th>Soal Esai</th>
                      <th>Jumlah Soal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{ujian.pg_limit ?? 0}</td>
                      <td>{ujian.essay_limit ?? 0}</td>
                      <td>{ujian.essay_limit + ujian.pg_limit}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-6">
              <div className="table-responsive">
                <table
                  className="table table-bordered"
                  width="100%"
                  cellSpacing="0"
                >
                  <thead>
                    <tr>
                      <th>Bank Pilihan Ganda</th>
                      <th>Bank Esai</th>
                      <th>Jumlah Soal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {ujian.examQuestions
                          ? ujian.examQuestions.filter(
                              (question) => question.is_essay == 0
                            ).length
                          : null}
                      </td>
                      <td>
                        {ujian.examQuestions
                          ? ujian.examQuestions.filter(
                              (question) => question.is_essay == 1
                            ).length
                          : null}
                      </td>
                      <td>
                        {ujian.examQuestions
                          ? ujian.examQuestions.filter(
                              (question) => question.is_essay == 0
                            ).length +
                            ujian.examQuestions.filter(
                              (question) => question.is_essay == 1
                            ).length
                          : null}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal edit soal */}
      <div
        class="modal fade"
        id="modalEdit"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Buat Soal
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <a
                href="/import-soal-goent.xlsx"
                target="_blank"
                className="btn btn-secondary"
              >
                Download Template Soal
              </a>
              <form onSubmit={handleImportExcelSubmit}>
                <Input
                  name="importExcel"
                  label="Import Soal dengan Excel"
                  type="file"
                  value={importExcel}
                  onChange={(e) => handleImportExcel(e)}
                />
                <button className="btn btn-success">
                  Import Excel <i className="fas fa-file-excel"></i>
                </button>
              </form>
              <hr />
              <ul className="list-group mb-4">
                <li className="list-group-item">
                  <div className="form-group">
                    <label htmlFor="question">Soal</label>
                    <MarkdownEditor
                      onChange={handleMakeQuestion}
                      value={stateEditQuestion?.question}
                      plugin={[
                        "font-bold",
                        "font-italic",
                        "font-underline",
                        "font-strikethrough",
                        "list-unordered",
                        "list-ordered",
                        "block-quote",
                        "block-code-inline",
                        "block-code-block",
                        "table",
                        "image",
                        "link",
                        "clear",
                        "logger",
                        "mode-toggle",
                        "full-screen",
                      ]}
                    />
                  </div>
                  {stateEditQuestion?.audio ? (
                    <div>
                      <audio controls>
                        <source
                          src={`${BASE_URL}/uploads/${stateEditQuestion?.audio}`}
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  ) : null}
                  <Input
                    name="audio"
                    label="Audio"
                    type="file"
                    value={answer.audio}
                    onChange={(e) => handleChange(e)}
                  />
                  {/* <Input
                    name="estimation"
                    label="Estimasi waktu menyelesaikan dalam menit"
                    type="number"
                    value={answer.estimation}
                    onChange={(e) => handleChange(e)}
                  />
                  <div className="form-group form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="confirm"
                      value={answer.is_essay}
                      onClick={() =>
                        setAnswer({ ...answer, is_essay: !answer.is_essay })
                      }
                    />
                    <label className="form-check-label" htmlFor="confirm">
                      Ceklis jika ini soal esai
                    </label>
                  </div> */}
                </li>
                {answer.is_essay
                  ? null
                  : stateEditQuestion?.examAnswers
                  ? stateEditQuestion?.examAnswers.map((examAnswer, idx) => {
                      const optButton = ["A", "B", "C", "D", "E"];
                      return (
                        <li className="list-group-item">
                          <div className="d-flex">
                            <div>
                              <span
                                className={
                                  examAnswer.is_answer
                                    ? "btn btn-success"
                                    : "btn btn-secondary"
                                }
                                onClick={() => handleClickOption(idx)}
                              >
                                {optButton[idx]}
                              </span>
                            </div>
                            <div className="flex-fill">
                              <MarkdownEditor
                                onChange={(e) =>
                                  handleMakeAnswer(e, `answer[${idx}]`)
                                }
                                height="200px"
                                name={`answer[${idx}]`}
                                defaultValue={examAnswer.answer}
                                // value={answer[`answer[${idx}]`]}
                                plugin={[
                                  "font-bold",
                                  "font-italic",
                                  "font-underline",
                                  "font-strikethrough",
                                  "block-code-inline",
                                  "block-code-block",
                                  "image",
                                  "clear",
                                  "logger",
                                  "mode-toggle",
                                  "full-screen",
                                ]}
                              />
                            </div>
                          </div>
                        </li>
                      );
                    })
                  : null}
              </ul>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleSubmit}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* modal input soal */}
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Buat Soal
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <a
                href="/import-soal-goent.xlsx"
                target="_blank"
                className="btn btn-secondary"
              >
                Download Template Soal
              </a>
              <form onSubmit={handleImportExcelSubmit}>
                <Input
                  name="importExcel"
                  label="Import Soal dengan Excel"
                  type="file"
                  value={importExcel}
                  onChange={(e) => handleImportExcel(e)}
                />
                <button className="btn btn-success">
                  Import Excel <i className="fas fa-file-excel"></i>
                </button>
              </form>
              <hr />
              <ul className="list-group mb-4">
                <li className="list-group-item">
                  <div className="form-group">
                    <label htmlFor="question">Soal</label>
                    <MarkdownEditor
                      onChange={handleMakeQuestion}
                      value={answer.question}
                      plugin={[
                        "font-bold",
                        "font-italic",
                        "font-underline",
                        "font-strikethrough",
                        "list-unordered",
                        "list-ordered",
                        "block-quote",
                        "block-code-inline",
                        "block-code-block",
                        "table",
                        "image",
                        "link",
                        "clear",
                        "logger",
                        "mode-toggle",
                        "full-screen",
                      ]}
                    />
                  </div>
                  <Input
                    name="audio"
                    label="Audio"
                    type="file"
                    value={answer.audio}
                    onChange={(e) => handleChange(e)}
                  />
                  <Input
                    name="estimation"
                    label="Estimasi waktu menyelesaikan dalam menit"
                    type="number"
                    value={answer.estimation}
                    onChange={(e) => handleChange(e)}
                  />
                  <div className="form-group form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="confirm"
                      value={answer.is_essay}
                      onClick={() =>
                        setAnswer({ ...answer, is_essay: !answer.is_essay })
                      }
                    />
                    <label className="form-check-label" htmlFor="confirm">
                      Ceklis jika ini soal esai
                    </label>
                  </div>
                </li>
                {answer.is_essay
                  ? null
                  : optionAnswer.map((optAnswer, idx) => {
                      const optButton = ["A", "B", "C", "D", "E"];
                      return (
                        <li className="list-group-item">
                          <div className="d-flex">
                            <div>
                              <span
                                className={
                                  optAnswer
                                    ? "btn btn-success"
                                    : "btn btn-secondary"
                                }
                                onClick={() => handleClickOption(idx)}
                              >
                                {optButton[idx]}
                              </span>
                            </div>
                            <div className="flex-fill">
                              <MarkdownEditor
                                onChange={(e) =>
                                  handleMakeAnswer(e, `answer[${idx}]`)
                                }
                                height="200px"
                                name={`answer[${idx}]`}
                                value={answer[`answer[${idx}]`]}
                                plugin={[
                                  "font-bold",
                                  "font-italic",
                                  "font-underline",
                                  "font-strikethrough",
                                  "block-code-inline",
                                  "block-code-block",
                                  "image",
                                  "clear",
                                  "logger",
                                  "mode-toggle",
                                  "full-screen",
                                ]}
                              />
                            </div>
                          </div>
                        </li>
                      );
                    })}
              </ul>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleSubmit}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Data Soal</h6>
        </div>
        <div className="card-body">
          <button
            type="button"
            class="btn btn-primary mb-4"
            data-toggle="modal"
            data-target="#exampleModal"
          >
            <i className="fas fa-plus mr-2"></i>
            Tambah Soal Baru
          </button>
          <h4>Bank Soal Pilihan Ganda</h4>
          {ujian.examQuestions
            ? ujian.examQuestions.map((examQuestion, idx) => {
                if (!examQuestion.is_essay) {
                  return (
                    <div key={examQuestion.id}>
                      <ul className="list-group mb-4">
                        <li className="list-group-item">
                          {/* <button
                            type="button"
                            class="btn btn-primary mb-4"
                            data-toggle="modal"
                            data-target="#modalEdit"
                            onClick={() => getDataForEdit(examQuestion.id)}
                          >
                            <i className="fas fa-edit mr-2"></i>
                            Ubah soal
                          </button> */}
                          <div className="mb-4">
                            <span>
                              Estimasi waktu mengerjakan{" "}
                              {examQuestion.estimation} (menit)
                            </span>
                          </div>

                          <h4>{examQuestion.question}</h4>

                          {examQuestion.audio ? (
                            <div>
                              <audio controls>
                                <source
                                  src={`${BASE_URL}/uploads/${examQuestion.audio}`}
                                  type="audio/mpeg"
                                />
                                Your browser does not support the audio tag.
                              </audio>
                            </div>
                          ) : null}
                        </li>
                        {examQuestion
                          ? examQuestion.examAnswers.map((answer, idx) => {
                              return (
                                <li
                                  key={answer.id}
                                  className={
                                    answer.is_answer
                                      ? "list-group-item active bg-success"
                                      : "list-group-item"
                                  }
                                >
                                  {idx + 1 == 1 ? "A" : null}{" "}
                                  {idx + 1 == 2 ? "B" : null}{" "}
                                  {idx + 1 == 3 ? "C" : null}{" "}
                                  {idx + 1 == 4 ? "D" : null}{" "}
                                  {idx + 1 == 5 ? "E" : null}.{" "}
                                  {answer.id === currentStateAnswerId
                                    ? null
                                    : answer.answer}
                                  {answer.id === currentStateAnswerId ? (
                                    <>
                                      <Input
                                        value={
                                          currentStateAnswer || answer.answer
                                        }
                                        onChange={(e) =>
                                          setCurrentStateAnswer(e.target.value)
                                        }
                                      />
                                      <div class="form-check">
                                        <input
                                          class="form-check-input"
                                          type="radio"
                                          name="exampleRadios"
                                          id="exampleRadios1"
                                          value="1"
                                          onChange={(e) =>
                                            setStateIsAnswer(e.target.value)
                                          }
                                          {...(answer.is_answer
                                            ? { checked: true }
                                            : null)}
                                        />
                                        <label
                                          class="form-check-label"
                                          for="exampleRadios1"
                                        >
                                          Kunci Jawaban
                                        </label>
                                      </div>
                                      <div class="form-check">
                                        <input
                                          class="form-check-input"
                                          type="radio"
                                          name="exampleRadios"
                                          id="exampleRadios2"
                                          value="0"
                                          onChange={(e) =>
                                            setStateIsAnswer(e.target.value)
                                          }
                                          {...(!answer.is_answer
                                            ? { checked: true }
                                            : null)}
                                        />
                                        <label
                                          class="form-check-label"
                                          for="exampleRadios2"
                                        >
                                          Bukan Kunci Jawaban
                                        </label>
                                      </div>
                                      <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                          saveUpdateAnswer(answer.id)
                                        }
                                      >
                                        Simpan
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      className="btn btn-secondary ml-2"
                                      onClick={() =>
                                        setCurrentStateAnswerId(answer.id)
                                      }
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                  )}
                                </li>
                              );
                            })
                          : null}
                      </ul>
                    </div>
                  );
                }
              })
            : null}
          <h4>Bank Soal Essay</h4>
          {ujian.examQuestions
            ? ujian.examQuestions.map((examQuestion, idx) => {
                if (examQuestion.is_essay) {
                  return (
                    <div key={examQuestion.id}>
                      <ul className="list-group mb-4">
                        <li className="list-group-item">
                          <div className="mb-4">
                            <span>
                              <Input
                                label="Estimasi waktu mengerjakan (menit)"
                                value={examQuestion.estimation}
                              />
                            </span>
                          </div>
                          {examQuestion.image ? (
                            <div>
                              <img
                                src={`${BASE_URL}/uploads/${examQuestion.image}`}
                                width="200px"
                              />
                            </div>
                          ) : null}
                          {examQuestion.audio ? (
                            <div>
                              <audio controls>
                                <source
                                  src={`${BASE_URL}/uploads/${examQuestion.audio}`}
                                  type="audio/mpeg"
                                />
                                Your browser does not support the audio tag.
                              </audio>
                            </div>
                          ) : null}
                          {idx + 1}. {examQuestion.question}
                        </li>
                      </ul>
                    </div>
                  );
                }
              })
            : null}
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

export default index;
