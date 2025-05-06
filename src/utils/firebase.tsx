// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, query, where, addDoc, deleteDoc, getDoc, or } from "firebase/firestore";
import { Bookings, Room } from "./types";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

export const getRoomsList = async () => {
  const roomsList: Room[] = [];
  const collectionRef = collection(db, 'roomsList');
  const snapshot = await getDocs(collectionRef);
  snapshot.forEach((doc) => {
      roomsList.push({name: doc.data().name, id: doc.data().id, desc: doc.data().desc});
  });
  return roomsList;
}

export const getRoomById = async (roomId: string) => {
  const collectionRef = collection(db, 'roomsList');
  const q = query(collectionRef, where("id", "==", roomId));
  const snapshot = await getDocs(q);
  let room: Room | null = null;
  snapshot.forEach((doc) => {
      room = {name: doc.data().name, id: doc.data().id, desc: doc.data().desc};
  });
  return room;
}

export const getBookingsByDate = async (date : string) => {
  const bookingsList: Bookings[] = [];

  const collectionRef = collection(db, 'roomBookings');
  const q = query(collectionRef, where("date", "==", date));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
      bookingsList.push({id: doc.id, date: doc.data().date, roomId: doc.data().roomId, bookedBy: doc.data().bookedBy, startTime: doc.data().startTime, endTime: doc.data().endTime});
  });
  return bookingsList;
}

export const addRoom = async (room: Room) => {
  const docRef = doc(db, 'roomsList', room.id);
  await setDoc(docRef, room);
}

export const addBooking = async (booking: { date: string; roomId: string; bookedBy: string; startTime: string; endTime: string; }) => {
  const colRef = collection(db, 'roomBookings');
  await addDoc(colRef, booking);
}

export const getBookingsByDateAndRoom = async (date: string, roomId: string) => {
  const bookingsList: Bookings[] = [];

  const collectionRef = collection(db, 'roomBookings');
  const q = query(collectionRef, where("date", "==", date), where("roomId", "==", roomId));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
      bookingsList.push({id: doc.id , date: doc.data().date, roomId: doc.data().roomId, bookedBy: doc.data().bookedBy, startTime: doc.data().startTime, endTime: doc.data().endTime});
  });
  return bookingsList;
}

export const deleteBooking = async (id: string) => {
  const docRef = doc(db, 'roomBookings', id);
  await deleteDoc(docRef);
}

export const deleteBookingByQuery = async () => {
  const collectionRef = collection(db, 'roomBookings');
  // const q = query(collectionRef, or(where("date", "==", date), where("roomId", "==", roomId), where("startTime", "==", startTime), where("endTime", "==", endTime)));
  const q = query(collectionRef, where("bookedBy", "==", "Luke"));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
      deleteBooking(doc.id);
  });
}

export const newUser = async (uid: string, email: string) => {
  const docRef = doc(db, 'users', uid);
  const newUser = {
    email: email,
    role: 'user',
  }
  await setDoc(docRef, newUser);
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