import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, collection, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import app from "../firebase";
import { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import Chat from "../Chat";
function Root() {
    const auth = getAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

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
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await fetchUserName(user.uid);
                await fetchProfilePicture(user.uid);
            } else {
                navigate("/signup");
            }
        });
    }, []);

    return (
        <div>
            <h1>Chat App</h1>
            <div className="flex gap-2 items-center">
                <img
                    src={profilePicture}
                    alt="Profile Picture"
                    className="rounded-full w-10 h-10 border-2 border-black"
                />
                <p>Hello, {username}!</p>
            </div>
            <Link to="/setting">Setting</Link>
            <Chat />
            <button onClick={() => signOut(auth)}>Sign Out</button>
        </div>
    );
}

export default Root;
