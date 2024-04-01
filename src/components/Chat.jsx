import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import app from "../firebase";
import { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import ChatBubble from "../components/ChatBubble";

function Chat() {
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);

    const auth = getAuth();

    const db = getFirestore(app);

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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <div className="w-full h-[100vh-1.25rem] margin-0 ">
            <div className="h-[51rem] max-h-[51rem] flex flex-col gap-10 mx-20 items-start overflow-y-auto no-scrollbar">
                {messages.map((message, i) => (
                    <ChatBubble
                        key={i}
                        text={message.text}
                        createdAt={message.createdAt}
                        uid={message.uid}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="sticky bottom-0 flex">
                <input
                    type="text"
                    placeholder="Message..."
                    className="h-[2.6rem] w-[90%] bg-[#2f2f2f] outline-transparent rounded-xl px-5"
                    onChange={(e) => setInputMessage(e.target.value)}
                    value={inputMessage}
                />
                <button
                    className="w-[10%] border border-black h-[2.6rem] bg-green-300 font-bold flex items-center justify-center gap-5 text-black"
                    onClick={sendMessage}
                >
                    <img
                        src="/images/send_button.svg"
                        alt="Send Icon"
                        className="w-5"
                    />
                    Send!
                    <img
                        src="/images/send_button.svg"
                        alt="Send Icon"
                        className="w-5"
                    />
                </button>
            </div>
        </div>
    );
}

export default Chat;
