import { db } from "../firebase/firebase";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";

const useFetchBackOffice = () => {
    const [backOfficeTotal, setBackOfficeTotal] = useState(null);
    const [backOfficeList, setBackOfficeList] = useState(null);
    const backOffice = [];
    useEffect(() => {
      fetchBlogs();
    }, []);
    const fetchBlogs = async () => {
      const backOfficeRef = collection(db, "back_office");
      const querySnapshot = await getDocs(backOfficeRef);
      querySnapshot.forEach((ok) => {
        if (!backOffice.includes(ok.data())) {
          backOffice.push(ok.data());
        }
      });
      setBackOfficeList(backOffice);
      setBackOfficeTotal(backOffice.length);
    };
  
    return { backOfficeTotal, backOfficeList };
}

export default useFetchBackOffice