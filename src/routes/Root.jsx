import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, collection, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import app from "../firebase";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

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
        console.log(data);
        setUsername(data.username);
    }

    async function fetchProfilePicture(uid) {
        const storage = getStorage();
        const profilePictureRef = await ref(storage, `profile-pictures/${uid}`);
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
            <div className="flex gap-2">
                <img
                    src={profilePicture}
                    alt="Profile Picture"
                    className="rounded-full w-50 h-50 border-2 border-black"
                />
                <p>Hello, {username}!</p>
            </div>
            <button onClick={() => signOut(auth)}>Sign Out</button>
        </div>
    );
}

export default Root;
