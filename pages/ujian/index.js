import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { CLIENT_AXIOS } from "../../client/clientAxios";
import moment from "moment";
import "moment/locale/id";
moment.locale("id");
import Countdown from "react-countdown";
import Link from "next/link";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  let user;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    console.log(err);
  }

  const [examClassrooms, setExamClassrooms] = useState([]);

  const getExamClassroom = async () => {
    let user;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const r = await CLIENT_AXIOS.get(`/students/exam-classroom`, {
      headers: {
        Authorization: `Bearer ${user ? user.access_token.token : null}`,
      },
    });

    setExamClassrooms(r.data);
  };

  useEffect(() => {
    getExamClassroom();
  }, []);

  const examTake = async (id) => {
    let user;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const r = await CLIENT_AXIOS.post(
      `/students/exam-classroom/${id}/take`,
      null,
      {
        headers: {
          Authorization: `Bearer ${user ? user.access_token.token : null}`,
        },
      }
    );

    if (r.data) {
      router.push(
        `/ujian/detail/[examClassroom]/[soal]`,
        `/ujian/detail/${r.data.exam_classroom_id}/${r.data.examTakes[0].id}`
      );
    }
  };

  return (
    <Layout>
      <h1 className="h3 mb-4 text-gray-800">Halaman Ujian</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Jadwal Ulangan</h6>
        </div>
        <div className="card-body">
          {examClassrooms.length
            ? examClassrooms.map((examClassroom) => {
                return (
                  <div
                    key={examClassroom.id}
                    className="list-group-item list-group-item-action mb-4 border rounded"
                  >
                    <div className="row">
                      <div className="col-lg-10 mb-2">
                        <h5 className="mb-1">
                          {examClassroom.exam.title} {}
                        </h5>
                      </div>
                      <div className="col-lg-2 mb-4">
                        {moment(examClassroom.end_time) <= new Date() ? (
                          <button className="btn btn-danger">
                            Sesi Berakhir
                          </button>
                        ) : (
                          <button className="btn btn-success">
                            Berakhir dalam{" "}
                            <Countdown date={examClassroom.end_time} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mb-1">
                      <ul>
                        <li>
                          Dimulai pada:{" "}
                          {moment(examClassroom.start_time).format(
                            "Do MMMM YYYY (hh:mm a)"
                          )}
                        </li>
                        <li>
                          Berakhir pada:{" "}
                          {moment(examClassroom.end_time).format(
                            "Do MMMM YYYY (hh:mm a)"
                          )}
                        </li>
                      </ul>
                    </div>
                    <small>
                      {examClassroom.examScores ? (
                        new Date(examClassroom.start_time) <= new Date() &&
                        new Date(examClassroom.end_time) >= new Date() ? (
                          examClassroom.examScores[0] ? (
                            examClassroom.examScores[0].status ? (
                              <Link
                                href={`/ujian/instruksi/[examClassroom]`}
                                as={`/ujian/instruksi/${examClassroom.id}`}
                              >
                                <a className="btn btn-primary">
                                  Lanjutkan Ujian
                                </a>
                              </Link>
                            ) : (
                              <button className="btn btn-primary">
                                Selesai
                              </button>
                            )
                          ) : (
                            <Link
                              href={`/ujian/instruksi/[examClassroom]`}
                              as={`/ujian/instruksi/${examClassroom.id}`}
                            >
                              <a className="btn btn-primary">Ikuti Ujian</a>
                            </Link>
                          )
                        ) : (
                          <button className="btn btn-primary" disabled>
                            Ditutup
                          </button>
                        )
                      ) : null}

                      {examClassroom.examScores[0] ? (
                        examClassroom.examScores[0].status == 0 ? (
                          <button
                            onClick={() => examTake(examClassroom.id)}
                            className="btn btn-secondary ml-3"
                          >
                            Lihat hasil
                          </button>
                        ) : null
                      ) : null}
                    </small>
                  </div>
                );
              })
            : "Tidak ada ujian"}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
