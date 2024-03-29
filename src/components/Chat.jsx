import { getFirestore, setDoc, doc } from "firebase/firestore";
import app from "../firebase";
function Chat() {
    const storage = getFirestore();
    return (
        <div className="w-full h-[100vh - 1.25rem] margin-0">
            <div className="h-[51rem]"></div>
            <input
                type="text"
                placeholder="Message..."
                className="h-[2.6rem] w-screen"
            />
        </div>
    );
}

export default Chat;
