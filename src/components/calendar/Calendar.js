import React, { useState, useEffect } from "react";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "daypilot-pro-react";
import "./calendar.css";
import { Navbar } from "../navbar/Navbar";
import { auth, db } from "../../firebase-config";
import { collection, getDocs } from "@firebase/firestore";

const styles = {
  wrap: {
    display: "flex",
  },
  left: {
    marginRight: "10px",
  },
  main: {
    flexGrow: "1",
  },
};

export const CalendarView = () => {
  const [eventsList, setEventsList] = useState({
    events: [
      {
        id: 1,
        text: "Ida åker hem från Göteborg",
        start: "2022-01-11T10:30:00",
        end: "2022-01-11T13:00:00",
      },
      {
        id: 2,
        text: "Ida läkarbesök",
        start: "2022-01-12T09:30:00",
        end: "2022-01-12T11:30:00",
        backColor: "#6aa84f",
      },
      {
        id: 3,
        text: "Storhandla",
        start: "2022-01-14T12:00:00",
        end: "2022-01-14T15:00:00",
        backColor: "#f1c232",
      },
      {
        id: 4,
        text: "Tvättstuga",
        start: "2022-01-13T11:30:00",
        end: "2022-01-13T14:30:00",
        backColor: "#cc4125",
      },
    ],
  });

  const [events, setEvents] = useState([]);

  const [calendarController, setcalendarController] = useState({
    locale: "en-gb",
    viewType: "Week",
    headerDateFormat: "ddd M/d/yyyy",
    showAllDayEvents: true,
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: function(args) {
      DayPilot.Modal.prompt("Create a new event:", "Event 1").then(function(
        modal
      ) {
        let dp = args.control;

        dp.clearSelection();
        if (!modal.result) {
          return;
        }
        dp.events.add(
          new DayPilot.Event({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            text: modal.result,
          })
        );
        setEventsList(dp.events.list);
        console.log(eventsList);
      });
    },

    eventDeleteHandling: "Update",
    onEventClick: async (args) => {
      let dp = args.control;
      const modal = await DayPilot.Modal.prompt(
        "Update event text:",
        args.e.text()
      );
      if (!modal.result) {
        return;
      }
      const e = args.e;
      e.data.text = modal.result;
      dp.events.update(e);
      setEventsList(dp.events.list);
    },
  });

  useEffect(() => {
    if (auth.currentUser) {
      let uid = auth.currentUser.uid;
      const usersCollectionRef = collection(db, "users", uid, "calendars");
      const getCalendars = async () => {
        const data = await getDocs(usersCollectionRef);
        setEvents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      };
      getCalendars();
    }
  }, [auth.currentUser]);

  console.log(eventsList.events);

  return (
    <>
      <Navbar></Navbar>
      {events.map((events) => {
        events.events.map((event) => {
          console.log(event);
          console.log(event.title);
          console.log(event.start.toDate());
          console.log(event.end.toDate());
        });
      })}
      <div className="calendar-wrapper" style={styles.wrap}>
        <div className="navigator" style={styles.left}>
          <DayPilotNavigator
            selectMode={"week"}
            showMonths={2}
            skipMonths={3}
            onTimeRangeSelected={(e) => {
              setcalendarController({
                startDate: e.day,
              });
            }}
          />
        </div>
        <div style={styles.main}>
          <DayPilotCalendar
            {...calendarController}
            events={eventsList.events}
            DayBeginsHour="6"
            DayEndsHour="6"
          />
        </div>
      </div>
    </>
  );
};
