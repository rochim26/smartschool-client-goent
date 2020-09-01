import React, { useState, useEffect } from "react";
import Layout from "../../../../components/Layout";
import Countdown from "react-countdown";
import { useRouter } from "next/router";
import moment from "moment";
import swal from "sweetalert";
import { CLIENT_AXIOS } from "../../../../client/clientAxios";

const Ujian = ({ examClassroom, soal }) => {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  const handleClick = async (idx, id) => {
    let user;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    setCurrentQuestion(idx);
    setCurrentTime(new Date());
    router.push(
      `/ujian/detail/[examClassroom]/[soal]`,
      `/ujian/detail/${examClassroom}/${id}`
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

    setExamTake(r.data);
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

  const handleSubmit = async () => {
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
      `/ujian/detail/[examClassroom]/[soal]?examClassroom=${examClassroom}`,
      `/ujian/detail/[examClassroom]/[soal]/${examClassroom}`
    );
  };

  const prevQuestion = () => {};

  const nextQuestion = () => {};

  useEffect(() => {
    getExamTake();
    getQuestion();
  }, [soal]);
  return (
    <Layout>
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
                    value={essay}
                  ></textarea>
                </div>
              </div>
            </div>
          ) : (
            <div className="list-group">
              {console.log(question)}
              {question.examQuestion
                ? question.examQuestion.examAnswers.map((answer, idx) => {
                    return (
                      <button
                        key={answer.id}
                        class={
                          question.exam_answer_id == answer.id
                            ? answer.is_answer
                              ? "list-group-item list-group-item-action mb-4 border shadow rounded active bg-success"
                              : "list-group-item list-group-item-action mb-4 border shadow rounded active bg-danger"
                            : answer.is_answer
                            ? "list-group-item list-group-item-action mb-4 border shadow rounded active bg-success"
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
          {/* <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Siswa waktu:{" "}
                <Countdown
                  date={moment(examTake.end_time).format()}
                  onComplete={handleSubmit}
                ></Countdown>
              </h6>
            </div>
          </div> */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Daftar Soal</h6>
            </div>
            <div className="card-body">
              <div className="row">
                {examTake.examTakes
                  ? examTake.examTakes.map((examTake, idx) => {
                      return (
                        <div
                          style={{ minWidth: 80 }}
                          className="col-md-3 col-lg-2 mb-3"
                          key={examTake.id}
                        >
                          <button
                            className={
                              examTake.exam_answer_id || examTake.essay
                                ? examTake.score
                                  ? "btn btn-success btn-block"
                                  : "btn btn-danger btn-block"
                                : "btn btn-danger btn-block"
                            }
                            key={examTake.id}
                            onClick={() => handleClick(idx + 1, examTake.id)}
                          >
                            {idx + 1}
                          </button>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <script src="/js/sb-admin-2.min.js" />
    </Layout>
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

export default Ujian;
