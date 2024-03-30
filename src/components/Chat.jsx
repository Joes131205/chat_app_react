import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import app from "../firebase";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

import ChatBubble from "../components/ChatBubble";

function Chat() {
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const auth = getAuth();

    const db = getFirestore(app);

    const docRef = collection(db, "messages");
    const docSnap = getDocs(docRef);

    function sendMessage(locale) {
        if (inputMessage) {
            const date = new Date();
            const options = {
                weekday: "short",
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            };
            const formatter = new Intl.DateTimeFormat(locale, options);
            const formattedDate = formatter.format(date);

            const uid = auth.currentUser.uid;
            const newMessageRef = collection(db, "messages");
            const newMessage = {
                text: inputMessage,
                createdAt: formattedDate,
                uid,
                time: Date.now(),
            };
            addDoc(newMessageRef, newMessage).then(() => {
                setInputMessage("");
            });
        }
    }

    useEffect(() => {
        const docRefAsc = collection(db, "messages");
        const currQuery = query(docRefAsc, orderBy("time", "asc"));
        const unsubscribe = onSnapshot(currQuery, (querySnapshot) => {
            const fetchedMessages = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [db]);
    return (
        <div className="w-full h-[100vh - 1.25rem] margin-0">
            <div className="h-[51rem] flex flex-col gap-20 mx-20">
                {messages.map((message, i) => (
                    <ChatBubble
                        key={i}
                        text={message.text}
                        createdAt={message.createdAt}
                        uid={message.uid}
                    />
                ))}
            </div>
            <input
                type="text"
                placeholder="Message..."
                className="h-[2.6rem] w-[90%] border border-black"
                onChange={(e) => setInputMessage(e.target.value)}
                value={inputMessage}
            />
            <button
                className="w-[10%] border border-black h-[2.6rem]"
                onClick={sendMessage}
            >
                Send!
            </button>
        </div>
    );
}

export default Chat;
