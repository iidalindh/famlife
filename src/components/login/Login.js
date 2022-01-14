import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { Navbar } from "../navbar/Navbar";
import "./login.css";
import { collection, getDocs } from "@firebase/firestore";
import { useForm } from "react-hook-form";

export const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);

  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log(data);
    };
    getUsers();
  }, []);

  // onAuthStateChanged(auth, (currentUser) => {
  //   setUser(currentUser);
  // });

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
      switch (error.code) {
        case "auth/user-not-found":
          alert("Email not found");
          break;
        case "auth/wrong-password":
          alert("Wrong password, try again.");
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
            {/* {users.map((userFromDoc) => {
              return (
                <div key={userFromDoc.id}>
                  <p>Email: {userFromDoc.email}</p>
                </div>
              );
            })} */}
            <p>
              Log in to your FamLife-account to get started <br /> with your
              family calendar!
            </p>
            <form className="form-section">
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
                onChange={(event) => {
                  setLoginPassword(event.target.value);
                }}
              />
              <button className="send-btn" type="submit" onClick={login}>
                Log in
              </button>
              <p>New to FamLife? Create an account here.</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
