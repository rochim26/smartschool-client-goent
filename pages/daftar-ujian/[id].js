import Layout from "../../components/Layout";
import { CLIENT_AXIOS } from "../../client/clientAxios";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const index = ({ id }) => {
  const [ujian, setUjian] = useState({});

  const fetchMember = async () => {
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

  useEffect(() => {
    fetchMember();
  }, []);

  return (
    <Layout>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">{ujian.title}</h1>
      </div>

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
                  <th>Soal Pilihan Ganda</th>
                  <th>Soal Esai</th>
                  <th>Jumlah Soal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{ujian.pg_limit}</td>
                  <td>{ujian.essay_limit}</td>
                  <td>{ujian.essay_limit + ujian.pg_limit}</td>
                </tr>
              </tbody>
            </table>
          </div>

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
