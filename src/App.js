import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import "./App.css";
import { Landingpage } from "./components/landingpage/Landingpage";
import { Login } from "./components/login/Login";
import { Register } from "./components/register/Register";
import { CalendarCopy } from "./components/calendar/CalendarCopy";
import { NewCalendar } from "./components/calendar/NewCalendar";
import { Dashboard } from "./components/dashboard/Dashboard";

function App() {
  const [user, setUser] = useState({});
  const currentUrl = window.location.pathname;
  console.log(currentUrl);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landingpage />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/calendar/:id"
            element={<CalendarCopy></CalendarCopy>}
          ></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/create-calendar" element={<NewCalendar />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
