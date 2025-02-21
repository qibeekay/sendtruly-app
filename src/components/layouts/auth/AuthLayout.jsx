import React from "react";
import styles from "./authlayout.module.css";
import logo from "../../../assets/logo.png";
import AuthForm from "../../forms/auth/AuthForm";
import { Link } from "react-router-dom";
function AuthLayout({ form, email }) {
  const LANDING_URL = import.meta.env.VITE_APP_LANDING_URL;

  function getText(str) {
    if (str === "register") {
      return "Register";
    } else if (str === "login") {
      return "Hey there, Welcome back.";
    } else if (str === "forgotpassword") {
      return "Forgot your password?";
    } else if (str === "verify") {
      return "Verify your email!";
    } else if (str === "kyc") {
      return "Verify your account";
    }
  }

  return (
    <div className={styles.authlayout_container}>
      <div
        className={styles.authlayout_inner}
        style={form !== "register" ? { flexDirection: "column" } : {}}
      >
        {form === "register" ? (
          <div className={styles.authlayout_left}>
            <Link to={LANDING_URL}>
              <img
                src={logo}
                className={styles.authlayout_left_img}
                alt="app logo"
              />
            </Link>
            <h1>Register for free</h1>
            <p>
              Sign up today and discover the limitless possibilities of our
              business text messaging platform to connect with customers,
              partners, and staff.
            </p>
            <ul>
              <li>
                <b>
                  Reach <span>over 5 billion</span> mobile phone users worldwide
                </b>{" "}
                Send targeted text messages with impressive 98% open rates.
              </li>
              <li>
                <b>
                  Keep audiences more engaged with <span>two-way texting</span>
                </b>{" "}
                On average, it takes up to 90 seconds to respond to a text
                message.
              </li>
              <li>
                <b>
                  All-in-one texting solution for <span>every use case</span>
                </b>{" "}
                Ideal for notifications, promotions, customer service, and
                beyond.
              </li>
            </ul>
          </div>
        ) : (
          <div
            className={styles.authlayout_left}
            style={
              form !== "register"
                ? {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: form === "kyc" ? "60px" : "",
                  }
                : {}
            }
          >
            <Link to={LANDING_URL}>
              <img src={logo} alt="app logo" />
            </Link>
            <h1
              style={
                form !== "register"
                  ? {
                      fontSize: "30px",
                      textAlign: "center",
                    }
                  : {}
              }
            >
              {getText(form)}
            </h1>
          </div>
        )}
        {/* <div className={styles.authlayout_right}> */}
        <AuthForm form={form} userMail={email} />
        {/* </div> */}
      </div>
    </div>
  );
}

export default AuthLayout;
