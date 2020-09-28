import React from "react";
import Layout from "../../components/new/Layout";

const index = () => {
  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <div class="card">
            <div class="card-body">This is some text within a card body.</div>
          </div>
        </div>
        <div className="col-md-6">
          <div class="card">
            <div class="card-body">This is some text within a card body.</div>
          </div>
        </div>
        <div className="col-md-3">
          <div class="card">
            <div class="card-body">This is some text within a card body.</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default index;
