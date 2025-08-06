// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, query, where, addDoc, deleteDoc, getDoc, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { BookingFormData, Bookings, Room } from "./types";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpJYyDKySuex1czcsHxM7hFEPNHo-TA1A",
  authDomain: "church-room-booking-538b3.firebaseapp.com",
  projectId: "church-room-booking-538b3",
  storageBucket: "church-room-booking-538b3.firebasestorage.app",
  messagingSenderId: "858624871611",
  appId: "1:858624871611:web:853ae4d1e5c59ad237ed9e",
  measurementId: "G-69QZZT9NDF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

// ROOMS FUNCTIONS
export const addRoom = async (room: Room) => {
  const docRef = doc(db, 'roomsList', room.id);
  await setDoc(docRef, room);
}

export const getRoomsList = async () => {
  const roomsList: Room[] = [];
  const collectionRef = collection(db, 'roomsList');
  const snapshot = await getDocs(collectionRef);
  snapshot.forEach((doc) => {
      roomsList.push({name: doc.data().name, id: doc.data().id, desc: doc.data().desc, img: doc.data().img});
  });
  return roomsList;
}

export const getRoomById = async (roomId: string) => {
  const collectionRef = collection(db, 'roomsList');
  const q = query(collectionRef, where("id", "==", roomId));
  const snapshot = await getDocs(q);
  let room: Room | null = null;
  snapshot.forEach((doc) => {
      room = {name: doc.data().name, id: doc.data().id, desc: doc.data().desc, img: doc.data().img};
  });
  return room;
}

// MINISTRY FUNCTIONS
export const addMinistry = async (ministry: {id: string, name: string; email: string }) => {
  const docRef = doc(db, 'ministries', ministry.id);
  await setDoc(docRef, ministry);
}

export const deleteMinistry = async (id: string) => {
  const docRef = doc(db, 'ministries', id);
  await deleteDoc(docRef);
}

export const getUserMinistry = async (email: string) => {
  const collectionRef = collection(db, 'ministries');
  const q = query(collectionRef, where("email", "==", email));
  const snapshot = await getDocs(q);
  let ministry: {id: string, name: string; email: string} = {id: '', name: '', email: ''};
  snapshot.forEach((doc) => {
      ministry = {id: doc.id, name: doc.data().name, email: doc.data().email};
  });
  return ministry.name || 'No Ministry Assigned';
}

export const getMinistries = async () => {
  const ministriesList: {id: string, name: string, email: string }[] = [];
  const collectionRef = collection(db, 'ministries');
  const snapshot = await getDocs(collectionRef);
  snapshot.forEach((doc) => {
      ministriesList.push({id: doc.id, name: doc.data().name, email: doc.data().email});
  });
  return ministriesList;
}

// BOOKING FUNCTIONS
export const addBooking = async (booking: BookingFormData) => {
  const colRef = collection(db, 'roomBookings');
  await addDoc(colRef, booking);
}

export const getBookingsByDate = async (date : string) => {
  const bookingsList: Bookings[] = [];

  const collectionRef = collection(db, 'roomBookings');
  const q = query(collectionRef, where("date", "==", date), where("pending", "==", false));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
      bookingsList.push({id: doc.id, date: doc.data().date, roomId: doc.data().roomId, 
        bookedBy: doc.data().bookedBy, startTime: doc.data().startTime, endTime: doc.data().endTime,
        ministry: doc.data().ministry, phoneNumber: doc.data().phoneNumber, email: doc.data().email, 
        description: doc.data().description, pending: doc.data().pending || false
      });
  });
  return bookingsList;
}

export const getBookingsByDateRange = async (startDate: string, endDate: string) => {
  let bookingsList: Bookings[] = [];

  const collectionRef = collection(db, 'roomBookings');
  const q = query(collectionRef, where("date", ">=", startDate), where("date", "<=", endDate), where("pending", "==", false));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    bookingsList = bookingsList.concat(addBookingToList(doc));
  });
  return bookingsList;
}

export const getBookingsByDateRangeAndRoom = async (startDate: string, endDate: string, roomId: string) => {
  let bookingsList: Bookings[] = [];

  const collectionRef = collection(db, 'roomBookings');
  const q = query(collectionRef, where("date", ">=", startDate), where("date", "<=", endDate), where("roomId", "==", roomId), where("pending", "==", false));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    bookingsList = bookingsList.concat(addBookingToList(doc));
  });
  return bookingsList;
}

export const getBookingsByDateAndRoom = async (date: string, roomId: string) => {
  let bookingsList: Bookings[] = [];

  const collectionRef = collection(db, 'roomBookings');
  const q = query(collectionRef, where("date", "==", date), where("roomId", "==", roomId), where("pending", "==", false));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    bookingsList = bookingsList.concat(addBookingToList(doc));
  });
  return bookingsList;
}

export const getPendingBookings = async () => {
  let bookingsList: Bookings[] = [];

  const collectionRef = collection(db, 'roomBookings');
  const q = query(collectionRef, where("pending", "==", true));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    bookingsList = bookingsList.concat(addBookingToList(doc));
  });
  return bookingsList;
}

export const approveBooking = async (bookingId: string) => {
  const bookingRef = doc(db, 'roomBookings', bookingId);
  await updateDoc(bookingRef, {pending: false});
}

const addBookingToList = (doc: QueryDocumentSnapshot): Bookings[] => {
  const bookingList: Bookings[] = [];
  bookingList.push({
    id: doc.id,
    date: doc.data().date,
    roomId: doc.data().roomId,
    bookedBy: doc.data().bookedBy,
    startTime: doc.data().startTime,
    endTime: doc.data().endTime,
    ministry: doc.data().ministry,
    phoneNumber: doc.data().phoneNumber,
    email: doc.data().email,
    description: doc.data().description,
    pending: doc.data().pending || true
  });
  return bookingList;
}



// DELETE BOOKING
export const deleteBooking = async (id: string) => {
  const docRef = doc(db, 'roomBookings', id);
  await deleteDoc(docRef);
}

export const deleteBookingByQuery = async () => {
  const collectionRef = collection(db, 'roomBookings');
  // const q = query(collectionRef, or(where("date", "==", date), where("roomId", "==", roomId), where("startTime", "==", startTime), where("endTime", "==", endTime)));
  const q = query(collectionRef, where("roomId", "==", "main-church"));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  } else {
    console.log("Found matching documents:", snapshot.size);
  }
  snapshot.forEach((doc) => {
      deleteBooking(doc.id);
  });
}

// AUTH
export const isLoggedIn = () => {
  return auth.currentUser !== null;
}

export const newUser = async (uid: string, email: string) => {
  const docRef = doc(db, 'users', uid);
  const newUser = {
    email: email,
    role: 'user',
  }
  await setDoc(docRef, newUser);
}

export const doesUserExist = async (uid: string) => {
  const docRef = doc(db, 'users', uid);
  const snapshot = await getDoc(docRef);
  return snapshot.exists();
}

export const getUserRole = async (uid: string) => {
  const docRef = doc(db, 'users', uid);
  const snapshot = await getDoc(docRef);
  let role: string | null = null;
  if (snapshot.exists()) {
    role = snapshot.data().role;
  }
  return role;
}