import app from "../base";
import {
  doc,
  setDoc,
  onSnapshot,
  where,
  addDoc,
  query,
  getFirestore,
  collection,
  getDocs,
  documentId,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import Header from "../components/Header";

const Home = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState([]);
  const [rec, setRec] = useState([]);

  const db = getFirestore(app);
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapShot = await getDocs(collection(db, "users"));
      const tempChats = [];
      usersSnapShot.docs.forEach((snap, i) => {
        if (snap.data().email !== currentUser?.email) {
          tempChats.push({ ...snap.data(), uid: snap.id });
        }
      });

      setChats([...tempChats]);
    };

    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!currentChat) return;

    return (
      onSnapshot(
        query(
          collection(db, "chats", currentUser?.uid, "messages"),
          where("recieverId", "==", currentChat?.authId)
        ),
        (querySnapShot) => {
          querySnapShot.docChanges().forEach((change, i) => {
            setMessages((prevState) =>
              sortMessages([...prevState, change.doc.data()])
            );
          });
        }
      ),
      onSnapshot(
        query(
          collection(db, "chats", currentChat?.authId, "messages"),
          where("recieverId", "==", currentUser?.uid)
        ),
        (querySnapShot) => {
          querySnapShot.docChanges().forEach((change, i) => {
            setMessages((prevState) =>
              sortMessages([...prevState, change.doc.data()])
            );
          });
        }
      )
    );
  }, [currentChat]);

  const sortMessages = (messages) => {
    return messages.sort((a, b) => a.createdAt.toDate() - b.createdAt.toDate());
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "chats", currentUser?.uid, "messages"), {
      sender: currentUser?.email,
      reciever: currentChat?.email,
      senderId: currentUser?.uid,
      recieverId: currentChat?.authId,
      message,
      createdAt: new Date(),
    })
      .then((res) => setMessage(""))
      .catch((err) => console.log(err, "error"));
  };

  return (
    <div className="">
      <Header />
      <div className="w-screen h-screen flex ">
        <div className="overflow-y-scroll w-3/12 min-h-screen bg-indigo-900">
          <div className="border-r  mt-12 ">
            {chats.map((chat, i) => (
              <button
                key={i}
                onClick={() => setCurrentChat(chat)}
                className=" w-full h-14 border- py-3  px-3 border-b border-indigo-800 hover:cursor-pointer"
              >
                <p className="text-left font-bold text-white">{chat.email}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="  w-9/12 absolute right-0 ml-auto self-end">
          {currentChat && (
            <div className="overflow-y-scroll">
              <div className="overflow-y-scroll">
                <div className="h-full flex flex-col ">
                  {messages.map((mes, i) => (
                    <div
                      key={i}
                      className={` flex p-3 h-10  ${
                        mes.senderId === currentUser?.uid
                          ? " text-right  justify-end"
                          : " text-left "
                      }`}
                    >
                      {mes.message}
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={(e) => sendMessage(e)}>
                <div className="w-full flex mb-2">
                  <input
                    className="border w-full h-12 mx-3 rounded-full"
                    required
                    autoFocus
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                    value={message}
                  />
                  <button
                    type="submit"
                    required
                    className="w-2/12 bg-indigo-400 rounded mx-2 text-white text-xl"
                  >
                    Send away
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
