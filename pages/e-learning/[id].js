import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CLIENT_AXIOS, BASE_URL } from "../../client/clientAxios";
import Link from "next/link";
import MarkdownEditor from "../../components/MarkdownEditor";
import ReactMarkdown from "react-markdown";
import swal from "sweetalert";

const eLearningDetail = ({ id }) => {
  const [subject, setSubject] = useState({});

  const fetchSubjectDetail = async () => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const res = await CLIENT_AXIOS.get(`/students/subjects/${id}`);
    setSubject(res.data);
  };

  useEffect(() => {
    fetchSubjectDetail();
  }, []);

  // essay
  const initialState = {
    content: "",
    note: "",
  };

  const [formInput, setFormInput] = useState(initialState);

  const handleMarkdown = ({ text }) => {
    setFormInput({ ...formInput, content: text });
  };

  const handleMarkdownNote = ({ text }) => {
    setFormInput({ ...formInput, note: text });
  };

  const handleSave = () => {
    swal("Berhasil disimpan", "", "success");
  };

  return (
    <Layout>
      <h1 className="h3 mb-4 text-gray-800">
        {subject.name} Kelas {subject.grade}
      </h1>
      <div className="card border-left-primary shadow h-100 py-2 mb-4">
        <div className="card-body">
          <div className="row no-gutters align-items-center">
            <div className="col mr-2">
              <div className="h5 font-weight-bold text-primary text-uppercase mb-1">
                Kelas Tatap Muka
              </div>
              <div className="mb-0 mt-4">
                <a
                  href={subject.gmeet}
                  target="_blank"
                  className="btn btn-warning"
                >
                  Gabung
                </a>
              </div>
            </div>
            <div className="col-auto">
              <i className="fas fa-video fa-2x text-gray-300"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="accordion" id="subjectMattersAccordion">
        {subject.subjectMatters
          ? subject.subjectMatters.map((matters) => {
              return (
                <div class="card">
                  <div class="card-header" id={`matters${matters.id}`}>
                    <h2 class="mb-0">
                      <button
                        class="btn btn-link btn-block text-left"
                        type="button"
                        data-toggle="collapse"
                        data-target={`#mattersCollapse${matters.id}`}
                        aria-expanded="true"
                        aria-controls={`mattersCollapse${matters.id}`}
                      >
                        <span className="h5 font-weight-bold">
                          {matters.title}
                        </span>{" "}
                        (<i>Estimasi {matters.estimation} menit</i>)
                      </button>
                    </h2>
                  </div>

                  <div
                    id={`mattersCollapse${matters.id}`}
                    class="collapse"
                    aria-labelledby={`matters${matters.id}`}
                    data-parent="#subjectMattersAccordion"
                  >
                    <div class="card-body">
                      {matters.essay ? (
                        <>
                          <div className="form-group">
                            <label>{matters.essay}</label>
                            <MarkdownEditor
                              onChange={handleMarkdown}
                              value={formInput.content}
                            />
                          </div>
                          <button
                            className="btn btn-primary"
                            onClick={handleSave}
                          >
                            Simpan
                          </button>
                        </>
                      ) : (
                        <div className="row">
                          <div className="col-lg-6">
                            {matters.video ? (
                              <video width="320" height="240" controls>
                                <source
                                  src={`${BASE_URL}/uploads/${matters.video}`}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            ) : matters.video_url ? (
                              <iframe
                                src={matters.video_url}
                                frameborder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                              ></iframe>
                            ) : (
                              "-"
                            )}
                            <ReactMarkdown source={matters.subject_matter} />
                            <div className="text-center">
                              <button className="btn btn-success">
                                Selesai
                              </button>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>Catatan</label>
                              <MarkdownEditor
                                onChange={handleMarkdownNote}
                                value={formInput.note}
                              />
                            </div>
                            <button
                              className="btn btn-primary"
                              onClick={handleSave}
                            >
                              Simpan
                            </button>
                          </div>
                          <div className="col-lg-12 mt-4">
                            <h4>Diskusi</h4>
                            <MarkdownEditor
                              onChange={handleMarkdownNote}
                              value={formInput.note}
                            />
                          </div>
                        </div>
                      )}
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

export async function getServerSideProps({ query: { id } }) {
  return {
    props: {
      id,
    },
  };
}

export default eLearningDetail;
