import React, { useState } from "react";
import { Navbar } from "../navbar/Navbar";
import "../login/login.css";
import { collection, setDoc, doc } from "@firebase/firestore";
import { auth, db } from "../../firebase-config";

export const NewCalendar = () => {
  const [calendarTitle, setCalendarTitle] = useState("");

  const postCalendar = async (e) => {
    e.preventDefault();
    const calendarCollection = collection(
      db,
      "users",
      auth.currentUser.uid,
      "calendars"
    );
    console.log(calendarCollection);
    await setDoc(doc(calendarCollection, calendarTitle), {
      events: [],
      users: [],
    }).then(function() {
      console.log("Frank food updated");
    });
  };

  return (
    <>
      <Navbar></Navbar>
      <section className="hero">
        <div className="hero-info">
          <h1>Create new calendar to get started</h1>
          <img src="/images/calendar.png" alt="" />
        </div>
        <div className="login-container">
          <div className="login">
            <h2>Create new calendar</h2>
            <p>Create a new calendar and invite users to join.</p>
            <form className="form-section" onSubmit={postCalendar}>
              <input
                type="text"
                placeholder="Calendar title"
                required
                onChange={(event) => {
                  setCalendarTitle(event.target.value);
                }}
              />
              <input type="email" placeholder="Add user email: " />
              <input type="email" placeholder="Add user email: " />
              <input type="email" placeholder="Add user email: " />
              <input type="email" placeholder="Add user email: " />
              <button className="send-btn" type="submit">
                Create new calendar
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
