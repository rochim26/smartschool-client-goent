import Layout from "../../components/Layout";
import { CLIENT_AXIOS } from "../../client/clientAxios";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import Link from "next/link";
import moment from "moment";
import "moment/locale/id";
moment.locale("id");

const index = () => {
  const [scheduleExam, setScheduleExam] = useState([]);

  const fetchClassroomSubject = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get("/teachers/get_exam_schedule", {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    });

    setScheduleExam(res.data);
  };

  useEffect(() => {
    fetchClassroomSubject();
  }, []);

  return (
    <Layout>
      <h1 className="h3 mb-4 text-gray-800">Jadwal Ujian</h1>
      <div className="row">
        {scheduleExam.length
          ? scheduleExam.map((schedule) => {
              return (
                <div className="col-xl-4 col-md-6 mb-4" key={schedule.id}>
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="h5 font-weight-bold text-primary text-uppercase mb-1">
                            {schedule.exam ? schedule.exam.title : null} (
                            {`${schedule.classroom.grade} ${schedule.classroom.major.abbr} ${schedule.classroom.code}`}
                            )
                          </div>
                          <div>
                            <b>
                              {new Date() < new Date(schedule.start_time)
                                ? "Mulai " +
                                  moment(schedule.start_time).fromNow()
                                : "Berakhir " +
                                  moment(schedule.end_time).fromNow()}
                            </b>
                          </div>
                          <div>
                            Mulai :{" "}
                            {moment(schedule.start_time).format(
                              "dddd, DD MMMM YYYY"
                            )}
                          </div>
                          <div>
                            Selesai :{" "}
                            {moment(schedule.end_time).format(
                              "dddd, DD MMMM YYYY"
                            )}
                          </div>
                          <div className="mb-0 mt-4">
                            <Link
                              href="/jadwal-ujian/[id]"
                              as={`/jadwal-ujian/${schedule.id}`}
                            >
                              <a className="btn btn-primary mr-2">Detail</a>
                            </Link>
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-book fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </Layout>
  );
};

export default index;
