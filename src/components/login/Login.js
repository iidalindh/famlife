import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import { Navbar } from "../navbar/Navbar";
import "./login.css";

export const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, seterror] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
      switch (error.code) {
        case "auth/user-not-found":
          seterror("Email not found");
          break;
        case "auth/wrong-password":
          seterror("Wrong password, try again.");
          break;
      }
    }
  };

  const currentUrl = window.location.pathname;
  console.log(currentUrl);

  return (
    <div>
      <Navbar></Navbar>
      <section className="hero">
        <div className="hero-info">
          <h1>
            Log in to access your FamLife Calendar
            <i className="fas fa-users"></i>
          </h1>
          <img src="/images/calendar.png" alt="" />
        </div>
        <div className="login-container">
          <div className="login">
            <h2>Log in</h2>

            <p>
              Log in to your FamLife-account to get started <br /> with your
              family calendar!
            </p>
            <form className="form-section" onSubmit={login}>
              <input
                type="email"
                placeholder="Email Address"
                required
                onChange={(event) => {
                  setLoginEmail(event.target.value);
                }}
              />
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(event) => {
                  setLoginPassword(event.target.value);
                }}
              />
              {error ? (
                <p
                  style={{ color: "red", marginBottom: 2 + "px", marginTop: 0 }}
                >
                  {error}
                </p>
              ) : (
                <></>
              )}
              <button className="send-btn" type="submit">
                Log in
              </button>

              <p>
                New to FamLife? Create an account{" "}
                <a className="link-to-register" href="/register">
                  here.
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
