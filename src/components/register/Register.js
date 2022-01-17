import React, { useState } from "react";
import { Navbar } from "../navbar/Navbar";
import { auth, createUserDocument } from "../../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "../login/login.css";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerLastname, setRegisterLastname] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      const newUser = {
        email: registerEmail,
        firstname: registerName,
        lastname: registerLastname,
      };
      await createUserDocument(user);
      console.log(user);

      navigate("/dashboard");
    } catch (error) {
      switch (error.code) {
        case "auth/weak-password":
          alert("Password must at lest be 6 characters");
          break;
        case "auth/email-already-in-use":
          alert("Email is already in use!");
          break;
      }
    }
  };

  return (
    <div>
      <Navbar />
      <section className="hero">
        <div className="hero-info">
          <h1>
            Sign up to create your first FamLife Calendar
            <i className="fas fa-users"></i>
          </h1>
          <img src="/images/calendar.png" alt="" />
        </div>
        <div className="login-container">
          <div className="register">
            <h2>Create Account</h2>
            <p>
              Sign up for your FamLife-account to get <br /> started with your
              first family calendar!
            </p>

            <form className="form-section" onSubmit={register}>
              <input
                type="text"
                placeholder="Firstname"
                required
                onChange={(event) => {
                  setRegisterName(event.target.value);
                }}
              />
              <input
                type="text"
                placeholder="Lastname"
                required
                onChange={(event) => {
                  setRegisterLastname(event.target.value);
                }}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                onChange={(event) => {
                  setRegisterEmail(event.target.value);
                }}
              />
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(event) => {
                  setRegisterPassword(event.target.value);
                }}
              />
              <button className="send-btn" type="submit">
                Create account
              </button>
              <p>
                Already have an FamLife-account? Log in{" "}
                <a className="link-to-login" href="/login">
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
