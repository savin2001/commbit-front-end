import { db } from "../firebase/firebase";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";

const useFetchUsers = ({ user }) => {
  const userRole = ["admin", "content_manager", "event_manager", "back_office"];
  const [usersTotal, setUsersTotal] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const [adminTotal, setAdminTotal] = useState(null);
  const [adminList, setAdminList] = useState(null);
  const [backOfficeTotal, setBackOfficeTotal] = useState(null);
  const [backOfficeList, setBackOfficeList] = useState(null);
  const [eventMgmtTotal, setEventMgmtTotal] = useState(null);
  const [eventMgmtList, setEventMgmtList] = useState(null);
  const [contentMgmtTotal, setContentMgmtTotal] = useState(null);
  const [contentMgmtList, setContentMgmtList] = useState(null);
  const [participantsTotal, setParticipantsTotal] = useState(null);
  const [participantsList, setParticipantsList] = useState(null);

  const users = [];
  const admin = [];
  const backOffice = [];
  const eventMgmt = [];
  const contentMgmt = [];
  const participants = [];

  useEffect(() => {
    fetchUsers();
    fetchAdmins();
    fetchBackOffice();
    fetchContentMgmt();
    fetchEventMgmt();
    fetchParticipants();
  }, [user]);

  const fetchUsers = async () => {
    setUsersList(users);
    setUsersTotal(users.length);
  };

  const fetchAdmins = async () => {
    setAdminList(admin);
    setAdminTotal(admin.length);
  };

  const fetchBackOffice = async () => {
    setBackOfficeList(backOffice);
    setBackOfficeTotal(backOffice.length);
  };

  const fetchEventMgmt = async () => {
    setEventMgmtList(eventMgmt);
    setEventMgmtTotal(eventMgmt.length);
  };

  const fetchContentMgmt = async () => {
    setEventMgmtList(contentMgmt);
    setEventMgmtTotal(contentMgmt.length);
  };

  const fetchParticipants = async () => {
    setEventMgmtList(participants);
    setEventMgmtTotal(participants.length);
  };

  return { usersTotal, usersList };
};

export default useFetchUsers;
