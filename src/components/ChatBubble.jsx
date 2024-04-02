import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import app from "../firebase";
import { useEffect, useState } from "react";
function ChatBubble({ text, createdAt, uid }) {
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

    const currUid = getAuth().currentUser.uid;

    async function fetchUserName(uid) {
        const db = getFirestore(app);
        const usersCollection = await collection(db, "users");
        const docRef = doc(usersCollection, uid);
        const docSnap = await getDoc(docRef);
        const data = await docSnap.data();
        setUsername(data.username);
    }

    async function fetchProfilePicture(uid) {
        const storage = getStorage();
        const profilePictureRef = ref(storage, `profile-pictures/${uid}.png`);
        const snap = await getDownloadURL(profilePictureRef);
        setProfilePicture(snap);
    }

    useEffect(() => {
        async function fetchData() {
            await fetchUserName(uid);
            await fetchProfilePicture(uid);
        }
        fetchData();
    }, []);

    return (
        <div
            className={`${
                uid === currUid
                    ? "  bg-[#008000] md:translate-x-[150%]"
                    : " bg-[#575757]"
            } flex text-2xl md:min-w-[40rem] md:max-w-[40rem] min-w-[10rem] max-w-[30rem]  py-5 px-5 text-[#E0E0E0] rounded-xl`}
        >
            <div className="flex flex-col gap-3">
                <div className="flex gap-10 items-center justify-center font-bold text-start">
                    <div className="flex gap-2 items-center justify-start">
                        <img
                            src={profilePicture}
                            alt="Profile Picture"
                            className="rounded-full w-10 h-10 border-2 border-black"
                        />
                        <p className="text-start">{username}</p>
                    </div>

                    <p>{createdAt}</p>
                </div>

                <p>{text}</p>
            </div>
        </div>
    );
}

export default ChatBubble;
