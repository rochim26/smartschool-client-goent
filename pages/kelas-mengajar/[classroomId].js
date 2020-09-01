import Layout from "../../components/Layout";
import { CLIENT_AXIOS } from "../../client/clientAxios";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const index = ({ classroomId }) => {
  const [cMember, setCMember] = useState({});

  const fetchMember = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get(
      `/teachers/classroom-members/${classroomId}`,
      {
        headers: {
          Authorization: `Bearer ${user.access_token.token}`,
        },
      }
    );

    console.log(res.data);

    setCMember(res.data);
  };

  useEffect(() => {
    fetchMember();
  }, []);

  return (
    <Layout>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/mata-pelajaran">
              <a>
                <i className="fas fa-chevron-left mr-2"></i>Kembali
              </a>
            </Link>
          </li>
        </ol>
      </nav>

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Daftar Anggota Kelas</h1>
      </div>
      <ul class="list-group">
        <li className="list-group-item border active">Wali Kelas</li>
        {cMember.length
          ? cMember
              .filter((member) => {
                return member.is_walas === 1;
              })
              .map((member) => {
                return (
                  <li key={member.id} class="list-group-item mb-4 border">
                    {member.name}
                  </li>
                );
              })
          : null}

        <li className="list-group-item border active">Daftar Siswa</li>
        {cMember.length
          ? cMember
              .filter((member) => {
                return member.is_walas === 0;
              })
              .map((member, idx) => {
                return (
                  <Link
                    key={member.id}
                    href="/siswa/[id]"
                    as={`/siswa/${member.id}`}
                  >
                    <a class="list-group-item border">
                      {idx + 1}. {member.name}
                    </a>
                  </Link>
                );
              })
          : null}
      </ul>
    </Layout>
  );
};

export async function getServerSideProps({ query: { classroomId } }) {
  return {
    props: {
      classroomId,
    },
  };
}

export default index;
