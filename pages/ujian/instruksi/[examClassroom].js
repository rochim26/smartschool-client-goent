import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CLIENT_AXIOS } from "../../../client/clientAxios";

const InstruksiUjian = ({ examClassroom }) => {
  const [exam, setExam] = useState({});

  const getDetail = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const r = await CLIENT_AXIOS.get(
      `/students/exam-classroom/${examClassroom}/exam-detail`,
      {
        headers: {
          Authorization: `Bearer ${user ? user.access_token.token : null}`,
        },
      }
    );

    setExam(r.data);
  };

  const [confirmation, setConfirmation] = useState(false);
  const [video, setVideo] = useState(false);

  const router = useRouter();

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
      console.log(r.data);
      router.push(
        `/ujian/[examClassroom]/[soal]`,
        `/ujian/${r.data.exam_classroom_id}/${r.data.examTakes[0].id}`
      );
    }
  };

  useEffect(() => {
    getDetail();
  }, []);
  return (
    <div className="bg-gradient-primary">
      <div className="container">
        {/* <!-- Outer Row --> */}
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                {/* <!-- Nested Row within Card Body --> */}
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4">
                      {exam.exam ? exam.exam.title : null}
                    </h1>
                  </div>
                  <ul className="list-group">
                    <li className="list-group-item">
                      Durasi: {exam.exam ? `${exam.exam.duration} menit` : null}
                    </li>
                    <li className="list-group-item">
                      Soal:{" "}
                      {exam.exam ? `${exam.exam.pg_limit} Pilihan Ganda` : null}
                      {exam.exam ? `dan ${exam.exam.essay_limit} Essay` : null}
                    </li>
                    <p className="text-center mt-5">
                      Sebelum memulai, peserta ujian diwajibkan untuk menyalakan
                      kamera sebagai syarat untuk mengikuti ujian
                    </p>
                    <a
                      className="btn btn-secondary btn-lg"
                      href={exam.exam ? exam.exam.gmeet : null}
                      target="_blank"
                      onClick={() => setVideo(true)}
                    >
                      Nyalakan kamera
                    </a>
                  </ul>
                  <hr />
                  <div className="form-group form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="confirm"
                      onClick={() => setConfirmation(true)}
                    />
                    <label className="form-check-label" htmlFor="confirm">
                      Saya sudah menyalakan kamera ujian, jika saya terlihat
                      tidak terlihat dalam rekaman saya siap untuk dikeluarkan
                      dari ujian.
                    </label>
                  </div>
                  {confirmation && video ? (
                    <button
                      className="btn btn-block btn-primary btn-lg"
                      onClick={() => examTake(exam.id)}
                    >
                      Ikuti Ujian
                    </button>
                  ) : (
                    <button
                      className="btn btn-block btn-primary btn-lg"
                      disabled
                    >
                      Ikuti Ujian
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ query: { examClassroom } }) {
  return {
    props: {
      examClassroom,
    },
  };
}

export default InstruksiUjian;
