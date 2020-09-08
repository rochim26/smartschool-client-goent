import Layout from "../../components/Layout";
import { CLIENT_AXIOS } from "../../client/clientAxios";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Line, HorizontalBar } from "react-chartjs-2";

const index = ({ id }) => {
  const [student, setStudent] = useState({});

  const fetchMember = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get(`/teachers/student/${id}`, {
      headers: {
        Authorization: `Bearer ${user.access_token.token}`,
      },
    });

    console.log(res.data);

    setStudent(res.data);
  };

  useEffect(() => {
    fetchMember();
  }, []);

  let labelExam = [];
  let scoreExam = [];

  return (
    <Layout>
      <div className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <h1 className="h3 mb-3 text-gray-800">{student.name}</h1>
          </div>
          <div className="col-md-6">
            <span className="btn btn-primary">NIS: {student.username}</span>
          </div>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header">Kontak</div>
        <div className="card-body">
          <a
            href={`https://wa.me/6${
              student.whatsapp ? student.whatsapp.substring(1) : null
            }`}
            className="btn btn-success"
          >
            <i className="fab fa-whatsapp"></i> {student.whatsapp}
          </a>
          <a href={`mailto:${student.email}`} className="btn btn-danger ml-4">
            <i className="fas fa-inbox"></i> {student.email}
          </a>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header">Ulangan</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <Line
                data={{
                  labels: labelExam,
                  datasets: [
                    {
                      label: `Grafik Nilai Ulangan ${student.name}`,
                      //   fill: false,
                      lineTension: 0.1,
                      backgroundColor: "rgba(75,192,192,0.4)",
                      borderColor: "rgba(75,192,192,1)",
                      borderCapStyle: "butt",
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: "miter",
                      pointBorderColor: "rgba(75,192,192,1)",
                      pointBackgroundColor: "#fff",
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: "rgba(75,192,192,1)",
                      pointHoverBorderColor: "rgba(220,220,220,1)",
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      data: scoreExam,
                    },
                  ],
                }}
              />
            </div>
            <div className="col-md-6">
              <HorizontalBar
                data={{
                  labels: labelExam,
                  datasets: [
                    {
                      label: `Grafik Nilai Ulangan ${student.name}`,
                      //   fill: false,
                      lineTension: 0.1,
                      backgroundColor: "rgba(75,192,192,0.4)",
                      borderColor: "rgba(75,192,192,1)",
                      borderCapStyle: "butt",
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: "miter",
                      pointBorderColor: "rgba(75,192,192,1)",
                      pointBackgroundColor: "#fff",
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: "rgba(75,192,192,1)",
                      pointHoverBorderColor: "rgba(220,220,220,1)",
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      data: scoreExam,
                    },
                  ],
                }}
              />
            </div>
          </div>
          <ul class="list-group mt-4">
            {student.examScores
              ? student.examScores.map((score) => {
                  scoreExam.push(score.score_pg);
                  labelExam.push(score.examClassroom.exam.title);
                  return (
                    <Link
                      key={score.id}
                      href="/siswa/ulangan/[id]"
                      as={`/siswa/ulangan/${score.id}`}
                    >
                      <a class="list-group-item">
                        {score.examClassroom.exam.title}
                      </a>
                    </Link>
                  );
                })
              : null}
          </ul>
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
