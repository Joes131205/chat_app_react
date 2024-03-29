import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../firebase";
import { useState } from "react";
import { getAuth } from "firebase/auth";
function Chat() {
    const [message, setMessage] = useState("");
    const db = getFirestore(app);
    const auth = getAuth();
    function sendMessage(locale) {
        if (message) {
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
                text: message,
                createdAt: formattedDate,
                uid,
            };
            addDoc(newMessageRef, newMessage).then(() => {
                setMessage("");
            });
        }
    }
    return (
        <div className="w-full h-[100vh - 1.25rem] margin-0">
            <div className="h-[51rem]"></div>
            <input
                type="text"
                placeholder="Message..."
                className="h-[2.6rem] w-[90%] border border-black"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
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
