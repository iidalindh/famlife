import React, { useEffect, useState } from "react";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "daypilot-pro-react";
import { auth, db } from "../../firebase-config";
import { Navbar } from "../navbar/Navbar";
import { collection, getDocs, doc } from "@firebase/firestore";
import { updateDoc } from "firebase/firestore";
import MediaQuery from "react-responsive";

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

export const CalendarCopy = () => {
  const [events, setEvents] = useState({ events: [] });
  const [eventsToDb, setEventsToDb] = useState([]);
  const addEvents = [];
  const currentURL = window.location.href;
  const calendarId = currentURL.substring(currentURL.lastIndexOf("/") + 1);
  const [calendarController, setcalendarController] = useState({
    locale: "en-gb",
    viewType: "Week",
    headerDateFormat: "ddd d/M-yyyy",
    showAllDayEvents: true,
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    startDate: new DayPilot.Date(),
    onTimeRangeSelected: function (args) {
      DayPilot.Modal.prompt("Create a new event:", "Event 1").then(
        async function (modal) {
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

          const newEvent = {
            text: modal.result,
            start: args.start.toDate(),
            end: args.end.toDate(),
            id: DayPilot.guid(),
          };
          addEvents.push(newEvent);
          setEventsToDb(addEvents);
          await addEventsToDb();
        }
      );
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
      setEvents(dp.events.list);
    },
  });

  useEffect(() => {
    if (auth.currentUser) {
      let uid = auth.currentUser.uid;
      let list = [];

      const usersCollectionRef = collection(db, "users", uid, "calendars");
      const getCalendars = async () => {
        const querySnapshot = await getDocs(usersCollectionRef);
        querySnapshot.forEach((doc) => {
          if (doc.id === calendarId) {
            doc.data().events.forEach((event) => {
              const myTitle = event.text;
              const myStart = new DayPilot.Date(event.start.toDate());
              const myEnd = new DayPilot.Date(event.end.toDate());
              const myId = DayPilot.guid();
              list.push({
                text: myTitle,
                start: myStart,
                end: myEnd,
                id: myId,
              });
              setEvents({ events: list });
            });
          }
        });
      };
      getCalendars();
    }
  }, [auth.currentUser]);

  const addEventsToDb = async () => {
    const calendarCollection = collection(
      db,
      "users",
      auth.currentUser.uid,
      "calendars"
    );
    await updateDoc(doc(calendarCollection, calendarId), {
      events: eventsToDb,
      users: [123],
    }).then(function () {
      console.log("Added events to db");
    });
  };

  const changeWeek = (days) => {
    let date = calendarController.startDate;
    let convertDate = date.toDate();
    convertDate.setDate(convertDate.getDate() + days);
    const newDate = new DayPilot.Date(convertDate);
    setcalendarController({
      startDate: newDate,
    });

    if (days === 0) {
      setcalendarController({
        startDate: new DayPilot.Date(),
      });
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let newCalendar = calendarId.replace("%20", " ");

  return (
    <>
      <Navbar></Navbar>
      <div className="wrapper">
        <h1 className="calendar-name">{newCalendar}</h1>
        <div className="calendar-wrapper" style={styles.wrap}>
          <MediaQuery minDeviceWidth={1224}>
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
                data-testid="month-picker"
              />
            </div>
            <div style={styles.main}>
              <DayPilotCalendar
                {...calendarController}
                events={events.events}
                DayBeginsHour="6"
                DayEndsHour="6"
                data-testid="calendar"
              />
            </div>
          </MediaQuery>
          <MediaQuery maxDeviceWidth={1224}>
            <div style={styles.main}>
              <div className="current-month">
                <h3>{monthNames[calendarController.startDate.getMonth()]}</h3>
              </div>
              <div className="change-week">
                <button onClick={() => changeWeek(-7)}>Previous</button>
                <button onClick={() => changeWeek(0)}>Today</button>
                <button onClick={() => changeWeek(7)}>Next</button>
              </div>
              <DayPilotCalendar
                {...calendarController}
                events={events.events}
                DayBeginsHour="6"
                DayEndsHour="6"
                data-testid="calendar"
                headerDateFormat="ddd d"
                hourWidth="45"
              />
            </div>
          </MediaQuery>
        </div>
      </div>
    </>
  );
};
