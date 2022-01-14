import React, { useEffect, useState } from "react";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "daypilot-pro-react";
import firebase from "firebase/compat/app";
import { auth, db } from "../../firebase-config";
import { Navbar } from "../navbar/Navbar";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  arrayUnion,
} from "@firebase/firestore";
import { updateDoc } from "firebase/firestore";

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

  const currentURL = window.location.href;
  const calendarId = currentURL.substring(currentURL.lastIndexOf("/") + 1);
  const [calendarController, setcalendarController] = useState({
    locale: "en-gb",
    viewType: "Week",
    headerDateFormat: "ddd M/d/yyyy",
    showAllDayEvents: true,
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: function(args) {
      DayPilot.Modal.prompt("Create a new event:", "Event 1").then(
        async function(modal) {
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
          setEvents(dp.events.list);
          // const myDoc = doc(
          //   db,
          //   "users",
          //   auth.currentUser.uid,
          //   "calendars",
          //   calendarId
          // );

          // await updateDoc(myDoc, {
          //   events: [events.events],
          // }).then(function() {
          //   console.log("Frank created");
          // });

          //   collection(db, "users", auth.currentUser.uid, "calendars")
          //     .doc(calendarId)
          //     .update({
          //       events: {
          //         food: "HEJ",
          //       },
          //     })
          //     .then(function() {
          //       console.log("Frank food updated");
          //     });
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
            console.log(doc.data());
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

  return (
    <>
      <Navbar></Navbar>

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
            events={events.events}
            DayBeginsHour="6"
            DayEndsHour="6"
          />
        </div>
      </div>
    </>
  );
};
