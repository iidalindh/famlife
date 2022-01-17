import React, { useState } from "react";
import { Navbar } from "../navbar/Navbar";
import "./calendar.css";
import { collection, setDoc, doc } from "@firebase/firestore";
import { auth, db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

export const NewCalendar = () => {
  const [calendarTitle, setCalendarTitle] = useState("");
  const navigate = useNavigate();

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
    }).then(function () {
      navigate("/dashboard");
      console.log("Frank food updated");
    });
  };

  return (
    <>
      <Navbar></Navbar>
      <section className="hero">
        <div className="newcalendar-container">
          <div className="create-new">
            <h1>Create new calendar</h1>
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
              <button className="create-btn" type="submit">
                Create new calendar
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
