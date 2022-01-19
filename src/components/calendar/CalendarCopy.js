import React, { useEffect, useState } from "react";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "daypilot-pro-react";
import { auth, db, firestore } from "../../firebase-config";
import { Navbar } from "../navbar/Navbar";
import { collection, getDocs, doc, arrayUnion } from "@firebase/firestore";
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
  let div = document.getElementsByTagName("div");
  for (let i = 0; i < div.length; i++) {
    if (div[i].innerHTML == "DEMO") {
      div[i].className = "hide-demo";
    }
  }
  const [events, setEvents] = useState({ events: [] });
  const addEvents = [];
  const currentURL = window.location.href;
  let calendarId = currentURL.substring(currentURL.lastIndexOf("/") + 1);
  calendarId = calendarId.replace("%20", " ");
  const [calendarController, setcalendarController] = useState({
    locale: "en-us",
    viewType: "Week",
    headerDateFormat: "ddd d/M-yyyy",
    durationBarVisible: false,
    eventDeleteHandling: "Update",
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

          console.log(dp.events.list);

          const newEvent = {
            text: modal.result,
            start: args.start.toDate(),
            end: args.end.toDate(),
            id: DayPilot.guid(),
          };
          addEvents.push(newEvent);
          await addEventsToDb();
          args.control.message("Event added: " + modal.result);
        }
      );
    },
    onEventMoved: async (args) => {
      const dp = args.control;
      dp.message("Moved: " + args.e.text());
      await updateEventToDb(args.e.data);
    },
    onEventClick: async (args) => {
      var dp = args.control;

      const form = [
        {
          name: "Event title",
          id: "text",
          type: "text",
        },
        {
          name: "Start",
          id: "start",
          type: "datetime",
          dateFormat: "MMMM/d/yyyy",
        },
        {
          name: "End",
          id: "end",
          type: "datetime",
          dateFormat: "MMMM/d/yyyy",
        },
      ];

      var data = args.e.data;

      var options = {
        autoFocus: true,
      };

      DayPilot.Modal.form(form, data, options).then(async function (margs) {
        console.log("modal", margs);

        if (!margs.canceled) {
          dp.events.update(margs.result);
          console.log(margs.result);
          await updateEventToDb(margs.result);
          args.control.message("Event changed: " + margs.result.text);
        }
      });
    },
    onEventDeleted: function (args) {
      args.control.message("Event deleted: " + args.e.text());
      deleteEventsFromDb(args.e.id());
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
              const myId = event.id;
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

  const deleteEventsFromDb = async (eventId) => {
    const eventsFromDb = [];
    const calendarCollectionRef = collection(
      db,
      "users",
      auth.currentUser.uid,
      "calendars"
    );

    const removeEvent = async () => {
      const allCalendars = await getDocs(calendarCollectionRef);
      allCalendars.forEach((document) => {
        if (document.id === calendarId) {
          document.data().events.forEach((event) => {
            eventsFromDb.push(event);
          });

          const updatedEventList = eventsFromDb.filter(
            (eventt) => eventt.id !== eventId
          );
          updateDoc(doc(calendarCollectionRef, calendarId), {
            events: updatedEventList,
          });
        }
      });
    };
    removeEvent();
  };

  const addEventsToDb = async () => {
    const calendarCollection = collection(
      db,
      "users",
      auth.currentUser.uid,
      "calendars"
    );

    await updateDoc(doc(calendarCollection, calendarId), {
      events: arrayUnion(...addEvents),
    });
  };

  const updateEventToDb = async (args) => {
    let newArr = [];
    const calendarCollection = collection(
      db,
      "users",
      auth.currentUser.uid,
      "calendars"
    );

    const data = args;

    const updatedEvent = {
      text: data.text,
      start: data.start.toDate(),
      end: data.end.toDate(),
      id: data.id,
    };

    const eventsFromDb = [];
    const allCalendars = await getDocs(calendarCollection);
    allCalendars.forEach((document) => {
      if (document.id === calendarId) {
        document.data().events.forEach((event) => {
          eventsFromDb.push(event);
        });
      }
    });

    newArr = eventsFromDb.map((obj) => {
      if (obj.id === updatedEvent.id) {
        return {
          text: updatedEvent.text,
          start: updatedEvent.start,
          end: updatedEvent.end,
          id: updatedEvent.id,
        };
      }

      return obj;
    });

    await updateDoc(doc(calendarCollection, calendarId), {
      events: newArr,
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

  const onClick = (event) => {
    console.log(event.srcElement);
  };
  window.addEventListener("click", onClick);

  return (
    <>
      <Navbar></Navbar>
      <div className="wrapper">
        <div className="calendar-wrapper">
          <h1 className="calendar-name">{calendarId}</h1>
          <div style={styles.wrap}>
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
      </div>
    </>
  );
};
