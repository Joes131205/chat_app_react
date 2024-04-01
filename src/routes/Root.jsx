import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, collection, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import app from "../firebase";
import { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import Chat from "../components/Chat";
import SideBar from "../components/SideBar";

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
        <div className="flex flex-col gap-5">
            <div className="flex gap-20 items-center">
                <SideBar
                    username={username}
                    profilePicture={profilePicture}
                    className="fixed top-0 "
                ></SideBar>
                <Link to="/setting" className="font-bold">
                    Setting
                </Link>
                <button onClick={() => signOut(auth)} className="font-bold">
                    Sign Out
                </button>
            </div>
            <Chat />
        </div>
    );
}

export default Root;
