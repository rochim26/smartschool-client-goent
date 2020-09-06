import Layout from "../../components/Layout";
import { CLIENT_AXIOS } from "../../client/clientAxios";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Input from "../../components/Input";
import moment from "moment";
import "moment/locale/id";
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
    console.log(importExcelUpload);

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
      swal("Berhasil!", "Soal berhasil tersimpan", "success");
      fetchDetail();
      setImportExcel("");
      setImportExcelUpload("");
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

      <div className="row">
        <div className="col-md-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Buat Soal</h6>
            </div>
            <div className="card-body">
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
                    <textarea
                      className="form-control"
                      id="question"
                      name="question"
                      rows="3"
                      value={answer.question}
                      onChange={(e) => handleChange(e)}
                    ></textarea>
                  </div>
                  <Input
                    name="image"
                    label="Gambar"
                    type="file"
                    value={answer.image}
                    onChange={(e) => handleChange(e)}
                  />
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
                              <Input
                                name={`answer[${idx}]`}
                                value={answer[`answer[${idx}]`]}
                                onChange={(e) => handleChange(e)}
                              />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Simpan
                </button>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Data Soal</h6>
            </div>
            <div className="card-body">
              {ujian.examQuestions
                ? ujian.examQuestions.map((examQuestion, idx) => {
                    return (
                      <div key={examQuestion.id}>
                        <ul className="list-group mb-4">
                          <li className="list-group-item">
                            <div className="mb-4">
                              <span>
                                Estimasi Waktu : {examQuestion.estimation} menit
                              </span>
                            </div>
                            {idx + 1}. {examQuestion.question}
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
                                    {idx + 1 == 5 ? "E" : null}. {answer.answer}
                                  </li>
                                );
                              })
                            : null}
                        </ul>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
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
