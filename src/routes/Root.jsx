import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, collection, getDoc } from "firebase/firestore";

import app from "../firebase";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

function Root() {
    const auth = getAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState();

    async function fetchUserName(uid) {
        const db = getFirestore(app);
        const usersCollection = await collection(db, "users");
        const docRef = doc(usersCollection, uid);
        const docSnap = await getDoc(docRef);
        const data = await docSnap.data();
        console.log(data);
        setUsername(data.username);
    }

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(user);
                await fetchUserName(user.uid);
            } else {
                navigate("/signup");
            }
        });
    }, []);
    return (
        <div>
            <h1>Chat App</h1>
            <p>Hello, {username}!</p>
            <button onClick={() => signOut(auth)}>Sign Out</button>
        </div>
    );
}

export default Root;
