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
    const [error, setError] = useState("");
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
        setError("");
        if (data.password === data.confirmPassword) {
            const { email, password } = data;
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    await storeUsername(user.uid, data.username);
                    await storeDefaultProfilePicture(user.uid);
                })
                .catch((error) => {
                    const message = error.message
                        .split("/")[1]
                        .slice(0, -2)
                        .replaceAll("-", " ");
                    setError(message[0].toUpperCase() + message.slice(1));
                });
        } else {
            setError("Password confirmation not matched");
        }
    }
    useEffect(() => {
        document.title = "Chat App | Sign Up";
    }, []);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });
    }, []);
    return (
        <div className="flex flex-col gap-10 items-center justify-center h-screen">
            <h1 className="font-bold text-4xl">Sign Up</h1>
            <form
                className="flex flex-col gap-10 items-center justify-center"
                onSubmit={signUpUser}
            >
                <div className="flex flex-col">
                    <label htmlFor="username" className="font-bold">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        onChange={(e) =>
                            setData({ ...data, username: e.target.value })
                        }
                        value={data.username}
                        className="text-black px-5 py-2 rounded-xl"
                        placeholder="Username..."
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="email" className="font-bold">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                        }
                        value={data.email}
                        className="text-black px-5 py-2 rounded-xl"
                        placeholder="Email..."
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="font-bold">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                        }
                        value={data.password}
                        className="text-black px-5 py-2 rounded-xl"
                        placeholder="Password..."
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="font-bold">
                        Confirm Password
                    </label>
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
                        className="text-black px-5 py-2 rounded-xl"
                        placeholder="Confirm Password.."
                    />
                </div>
                <button
                    type="submit"
                    className="px-5 py-2 bg-green-500 text-black rounded-md cursor-pointer font-bold hover:scale-110 transition"
                >
                    Sign Up!
                </button>
            </form>
            <p className="text-red-600 font-bold">{error ?? ""}</p>

            <Link to="/signin">Already have an account?</Link>
        </div>
    );
}

export default SignUp;
