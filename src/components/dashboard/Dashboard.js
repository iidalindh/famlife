import React, { useState, useEffect } from "react";
import { Navbar } from "../navbar/Navbar";
import "./dashboard.css";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase-config";
import { collection, getDocs } from "@firebase/firestore";

export const Dashboard = () => {
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      let uid = auth.currentUser.uid;
      const usersCollectionRef = collection(db, "users", uid, "calendars");
      const getCalendars = async () => {
        const data = await getDocs(usersCollectionRef);
        setCalendars(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      };
      getCalendars();
    }
  }, [auth.currentUser]);
  return (
    <div>
      <Navbar></Navbar>
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="box-container">
          <Link to={`/create-calendar`}>
            <div className="dashboard-box create-new">
              <p>Create new calendar</p>
              <i className="fas fa-plus"></i>
            </div>
          </Link>
          {calendars.map((calendarFromDoc) => {
            return (
              <Link
                to={`/calendar/` + calendarFromDoc.id}
                key={calendarFromDoc.id}
              >
                <div className="dashboard-box ">
                  <p>{calendarFromDoc.id}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
