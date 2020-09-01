import { useEffect, useState } from "react";
import { CLIENT_AXIOS } from "../../../client/clientAxios";
import Layout from "../../../components/Layout";
import Input from "../../../components/Input";

const index = ({ id }) => {
  const [score, setScore] = useState({});

  const fetchMember = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get(`/teachers/student/exam-score/${id}`, {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    });

    console.log(res.data);

    setScore(res.data);
  };

  useEffect(() => {
    fetchMember();
  }, []);

  return (
    <Layout>
      <div className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <h1 className="h3 mb-3 text-gray-800">
              {score.user ? score.user.name : null}
            </h1>
          </div>
        </div>
      </div>

      <div className="mb-4 d-flex align-items-center justify-content-between bg-success shadow rounded text-white">
        <button className="btn btn-lg text-white">
          <div>Pilihan Ganda</div>
          {score.score_pg}
        </button>
        <i className="fas fa-plus"></i>
        <button className="btn btn-lg text-white">
          <div>Essay</div>
          {score.score_essay}
        </button>
        <i className="fas fa-equals"></i>
        <button className="btn btn-lg text-white">
          <div>Hasil</div>
          {score.score_pg + score.score_essay}
        </button>
      </div>

      <h3>Pilihan Ganda</h3>

      {score.examTakes
        ? score.examTakes.map((examTake) => {
            if (!examTake.is_essay) {
              return (
                <div>
                  <ul className="list-group mb-4">
                    <li class="list-group-item">
                      <div>
                        {examTake.duration >=
                          examTake.examQuestion.estimation * 60 ||
                        examTake.duration < 10 ? (
                          <div className="mb-4">
                            <h4>
                              <span class="badge badge-warning">
                                Terindikasi Kecurangan
                                <a
                                  href={`https://wa.me/62${
                                    score.user.whatsapp
                                  }?text=${"Halo, nak apakah kamu benar dalam menjawab pertanyaan ini?"} ${
                                    examTake.examQuestion.question
                                  }`}
                                  target="_blank"
                                  className="ml-2 badge badge-success"
                                >
                                  <i className="fab fa-whatsapp mr-2"></i>
                                  Konfirmasi siswa
                                </a>
                              </span>
                            </h4>
                            <span className="mr-2">
                              Estimasi Waktu :{" "}
                              {examTake.examQuestion.estimation * 60} detik
                            </span>
                            <span>
                              Waktu Mengerjakan : {examTake.duration} detik
                            </span>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <h4>
                              <span class="badge badge-success">Jujur</span>
                            </h4>
                            <span>
                              Estimasi Waktu :{" "}
                              {examTake.examQuestion.estimation * 60} detik
                            </span>
                            <span>
                              {" "}
                              Waktu Mengerjakan : {examTake.duration} detik
                            </span>
                          </div>
                        )}
                      </div>
                      <h4>{examTake.examQuestion.question}</h4>
                    </li>
                    {examTake.examQuestion
                      ? examTake.examQuestion.examAnswers.map((answer, idx) => {
                          return (
                            <li
                              class={
                                answer.id == examTake.exam_answer_id
                                  ? answer.is_answer
                                    ? "list-group-item text-white bg-success"
                                    : "list-group-item text-white bg-danger"
                                  : answer.is_answer
                                  ? "list-group-item bg-success text-white"
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
            }
          })
        : null}

      <h3>Essay</h3>

      {score.examTakes
        ? score.examTakes.map((examTake) => {
            if (examTake.is_essay) {
              return (
                <div>
                  <ul className="list-group mb-4">
                    <li class="list-group-item">
                      <div>
                        {examTake.duration >=
                          examTake.examQuestion.estimation * 60 ||
                        examTake.duration < 10 ? (
                          <div className="mb-4">
                            <h4>
                              <span class="badge badge-warning">
                                Terindikasi Kecurangan
                                <a
                                  href={`https://wa.me/62${
                                    score.user.whatsapp
                                  }?text=${"Halo, nak apakah kamu benar dalam menjawab pertanyaan ini?"} ${
                                    examTake.examQuestion.question
                                  }`}
                                  target="_blank"
                                  className="ml-2 badge badge-success"
                                >
                                  <i className="fab fa-whatsapp mr-2"></i>
                                  Konfirmasi siswa
                                </a>
                              </span>
                            </h4>
                            <span className="mr-2">
                              Estimasi Waktu :{" "}
                              {examTake.examQuestion.estimation * 60} detik
                            </span>
                            <span>
                              Waktu Mengerjakan : {examTake.duration} detik
                            </span>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <h4>
                              <span class="badge badge-success">Jujur</span>
                            </h4>
                            <span>
                              Estimasi Waktu :{" "}
                              {examTake.examQuestion.estimation * 60} detik
                            </span>
                            <span>
                              {" "}
                              Waktu Mengerjakan : {examTake.duration} detik
                            </span>
                          </div>
                        )}
                      </div>
                      <h3>{examTake.examQuestion.question}</h3>
                      <div className="bg-light p-3 mb-4">
                        <p>{examTake.essay}</p>
                      </div>
                      <Input type="number" label="Poin untuk jawaban ini" />
                    </li>
                  </ul>
                </div>
              );
            }
          })
        : null}
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
