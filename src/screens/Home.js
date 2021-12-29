import app from "../base";
import {
  onSnapshot,
  where,
  doc,
  addDoc,
  query,
  getFirestore,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { useEffect, useState, useContext } from "react";
import Header from "../components/Header";
import CurrentUserContext from "../context/currentUserContext";
import Spinner from "../components/Spinner";

const Home = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const currentUser = useContext(CurrentUserContext);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(
        collection(db, "conversations"),
        where("senderId", "==", currentUser.uid)
      );
      const usersSnapShot = await getDocs(q);
      const tempChats = [];
      usersSnapShot.docs.forEach((snap, i) => {
        if (snap.data().email !== currentUser?.email) {
          tempChats.push({ ...snap.data(), uid: snap.id });
        }
      });

      setChats([...tempChats]);
    };

    fetchUsers();
    //eslint-disable-next-line
  }, [currentUser]);

  useEffect(() => {
    if (!currentChat) return;

    return (
      onSnapshot(
        query(
          collection(db, "chats", currentUser?.uid, "messages"),
          where("recieverId", "==", currentChat?.recieverId)
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
          collection(db, "chats", currentChat?.recieverId, "messages"),
          where("recieverId", "==", currentUser?.uid)
        ),
        (querySnapShot) => {
          querySnapShot.docChanges().forEach((change, i) => {
            setMessages((prevState) =>
              sortMessages([...prevState, change.doc.data()])
            );
          });
          setLoading(false);
        }
      )
    );
    //eslint-disable-next-line
  }, [currentChat]);

  const sortMessages = (messages) => {
    return messages.sort((a, b) => a.createdAt.toDate() - b.createdAt.toDate());
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const msg = message;
    setMessage("");

    await setDoc(
      doc(db, "conversations", currentUser?.uid),
      {
        sender: currentUser?.email,
        reciever: currentChat?.email,
        senderId: currentUser?.uid,
        recieverId: currentChat?.authId,
        lastMessageAt: new Date(),
      },
      { merge: true }
    );

    await addDoc(collection(db, "chats", currentUser?.uid, "messages"), {
      sender: currentUser?.email,
      reciever: currentChat?.email,
      senderId: currentUser?.uid,
      recieverId: currentChat?.authId,
      message: msg,
      createdAt: new Date(),
    })
      .then((res) => setMessage(""))
      .catch((err) => console.log(err, "error"));
  };

  const searchUser = async (e) => {
    e.preventDefault();
    const value = searchValue;
    setSearchValue("");
    const q = query(collection(db, "users"), where("email", "==", value));
    const usersSnapShot = await getDocs(q);
    const newChat = usersSnapShot.docs[0]?.data();
    setChats([
      { reciever: newChat.email, recieverId: newChat?.authId },
      ...chats,
    ]);
    setCurrentChat({ reciever: newChat.email, recieverId: newChat?.authId });
  };

  return (
    <div className="">
      <Header />
      <div className="w-screen h-screen flex ">
        <div className="flex flex-col justify-between overflow-y-scroll w-3/12 min-h-screen bg-indigo-900">
          <div className="border-r  mt-12 ">
            <form onSubmit={(e) => searchUser(e)}>
              <input
                className="my-3 h-12 w-11/12 rounded-full text-center"
                placeholder="search email"
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
              />
            </form>
            {chats.map((chat, i) => (
              <button
                key={i}
                onClick={() => {
                  if (currentChat?.reciever === chat.reciever) return;
                  setMessages([]);
                  setCurrentChat(chat);
                }}
                className=" w-full h-14 border- py-3  px-3 border-b border-indigo-800 hover:cursor-pointer"
              >
                <p className="text-left font-bold text-white">
                  {chat.reciever}
                </p>
              </button>
            ))}
          </div>
          <div>
            {/* <button className="text-white h-12 mb-4">New conversation</button> */}
          </div>
        </div>

        <div className="  w-9/12 absolute right-0 ml-auto self-end">
          {currentChat && (
            <div className="">
              <div className="">
                {loading ? (
                  <div className="my-5">
                    <Spinner />
                  </div>
                ) : (
                  <div className=" flex flex-col overflow-scroll">
                    {messages.map((mes, i) => (
                      <div
                        key={i}
                        className={`max-w-xs break-words text-wrap my-2 min-w-1/2 px-2 flex flex-col rounded ${
                          mes.senderId === currentUser?.uid
                            ? "bg-indigo-500 self-end"
                            : "bg-indigo-800 bg-opacity-75 self-start"
                        }`}
                      >
                        <p
                          className={` text-left ${
                            mes.senderId === currentUser?.uid
                              ? "text-white "
                              : "text-white"
                          }`}
                        >
                          {mes.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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
