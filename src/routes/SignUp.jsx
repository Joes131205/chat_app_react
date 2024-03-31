import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../firebase";
import { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";

function SignUp() {
    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const auth = getAuth();
    const navigate = useNavigate();
    const storage = getStorage();
    async function storeUsername(uid, username) {
        if (username === "") {
            username = `User ${uid.slice(1, 5)}`;
        }
        try {
            const db = getFirestore(app);
            const docRef = doc(db, "users", uid);
            await setDoc(docRef, { username });
        } catch (error) {
            console.log(error);
        }
    }
    async function storeDefaultProfilePicture(uid) {
        const imagePath = "/images/default_profile_picture.png";
        const response = await fetch(imagePath);
        const blob = await response.blob();
        const newFileName = `${uid}.png`;
        const storageRef = ref(storage, `profile-pictures/${newFileName}`);
        const metadata = {
            contentType: "image/png",
        };
        await uploadBytes(storageRef, blob, metadata);
    }
    async function signUpUser(e) {
        e.preventDefault();
        if (data.password === data.confirmPassword) {
            const { email, password } = data;
            await createUserWithEmailAndPassword(auth, email, password).then(
                async (userCredential) => {
                    const user = userCredential.user;
                    await storeUsername(user.uid, data.username);
                    await storeDefaultProfilePicture(user.uid);
                }
            );
        }
    }
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });
    }, []);
    return (
        <div className="flex flex-col gap-10 items-center justify-center h-screen">
            <h1>Sign Up</h1>
            <form
                className="flex flex-col gap-10 items-center justify-center"
                onSubmit={signUpUser}
            >
                <div className="flex flex-col">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        onChange={(e) =>
                            setData({ ...data, username: e.target.value })
                        }
                        value={data.username}
                        className="text-black"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                        }
                        value={data.email}
                        className="text-black"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                        }
                        value={data.password}
                        className="text-black"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        onChange={(e) =>
                            setData({
                                ...data,
                                confirmPassword: e.target.value,
                            })
                        }
                        value={data.confirmPassword}
                        className="text-black"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            <Link to="/signin">Already have an account?</Link>
        </div>
    );
}

export default SignUp;
