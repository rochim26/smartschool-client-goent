import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import firebaseApp from "../../util/firebase";
import { CLIENT_AXIOS } from "../../client/clientAxios";
import moment from "moment";
import "moment/locale/id";
moment.locale("id");

const index = ({ id }) => {
  const [streamingStudent, setStreamingStudent] = useState([]);
  const [schedule, setSchedule] = useState({});

  const getDetail = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get(`/teachers/get_exam_schedule/${id}`);
    console.log(res.data);
    setSchedule(res.data);
  };

  useEffect(() => {
    getDetail();
  }, []);

  const getStream = () => {
    const todoRef = firebaseApp
      .database()
      .ref("examTake")
      .orderByChild("activity");
    todoRef.on("value", (snapshot) => {
      const todos = snapshot.val();
      console.log(todos);
      const streamingStudent = [];
      for (let id in todos) {
        streamingStudent.push({ id, ...todos[id] });
      }
      setStreamingStudent(
        streamingStudent.sort((a, b) => {
          return b.activity - a.activity;
        })
      );
    });
  };

  useEffect(() => {
    getStream();
    setInterval(function () {
      getStream();
    }, 150000);
  }, []);
  return (
    <Layout>
      {console.log(streamingStudent)}
      <h1 className="h3 mb-4 text-gray-800">
        Streaming Kelas{" "}
        {schedule.classroom
          ? `${schedule.classroom.grade} ${schedule.classroom.major.abbr} ${schedule.classroom.code}`
          : null}
      </h1>

      <div className="row">
        <div className="col-md-6">
          <h3>Peserta Check In</h3>
          {schedule.classroom
            ? schedule.classroom.classroomMembers.map((member) => {
                if (
                  streamingStudent.find(
                    (student) => student.user_id == member.user_id
                  )
                ) {
                  return (
                    <div>
                      {member.user.name}{" "}
                      {streamingStudent.find(
                        (student) => student.user_id == member.user_id
                      ).activity +
                        300000 <=
                      new Date().getTime() ? (
                        <>
                          <span className="badge badge-danger">offline</span>
                          <a
                            href={`https://wa.me/62${
                              member.user.whatsapp
                            }?text=${"Halo, nak apakah internet kamu bermasalah?"}`}
                            target="_blank"
                            className="ml-2 badge badge-success"
                          >
                            <i className="fab fa-whatsapp mr-2"></i>
                            Konfirmasi siswa
                          </a>
                        </>
                      ) : (
                        <span className="badge badge-success">online</span>
                      )}
                    </div>
                  );
                }
              })
            : null}
        </div>
        <div className="col-md-6">
          <h3>Peserta Ujian</h3>
          {schedule.classroom
            ? schedule.classroom.classroomMembers.map((member) => {
                if (!member.is_walas) {
                  if (
                    streamingStudent.find(
                      (student) => student.user_id == member.user_id
                    )
                  ) {
                    return (
                      <div>
                        {member.user.name}{" "}
                        <span className="badge badge-success">check in</span>
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        {member.user.name}{" "}
                        <span className="badge badge-danger">
                          belum check in
                        </span>
                      </div>
                    );
                  }
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
