import React from "react";
import { Navbar } from "../navbar/Navbar";
import "./landingpage.css";

export const Landingpage = () => {
  return (
    <div className="landingPage">
      <Navbar />
      <section className="hero">
        <div className="content">
          <div className="heading">
            <h1>
              Plan your family events <br /> and activites <span>togheter</span>
            </h1>
          </div>
          <div className="cta-button">
            <button>Get FamLife Free</button>
          </div>
          <div className="bullet-list">
            <ul>
              <li>
                <i className="fas fa-thumbs-up"></i> Shared calendar
              </li>
              <li>
                <i className="fas fa-thumbs-up"></i> Assign tasks
              </li>
              <li>
                <i className="fas fa-thumbs-up"></i> Get organized
              </li>
            </ul>
          </div>
        </div>
        <div className="hero-img">
          <img src="/images/calendar.png" alt="" />
        </div>
      </section>
    </div>
  );
};
