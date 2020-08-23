import Head from "next/head";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { CLIENT_AXIOS } from "../client/clientAxios";
import moment from "moment";
import "moment/locale/id";
moment.locale("id");
import Countdown from "react-countdown";
import Link from "next/link";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const [userLogin, setUserLogin] = useState(null);

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserLogin(user);
    }
  } catch (err) {
    console.log(err);
  }

  const [examClassrooms, setExamClassrooms] = useState([]);

  const fetchData = async () => {
    let user;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }

    const r = await CLIENT_AXIOS.get(`/blogs/all`, {
      headers: {
        Authorization: `Bearer ${user ? user.access_token.token : null}`,
      },
    }).catch((err) => {
      router.push("/login");
    });

    if (r) {
      setExamClassrooms(r.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <h1 className="h3 mb-4 text-gray-800">
        Halo, Selamat Datang {userLogin ? userLogin.user.name : null} 👋
      </h1>
    </Layout>
  );
};

export default Index;
