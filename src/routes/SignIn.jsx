import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";

import app from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignIn() {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();
    auth.useDeviceLanguage();
    const provider = new GoogleAuthProvider();

    async function signInUser(e) {
        e.preventDefault();
        setError("");
        const { email, password } = data;
        await signInWithEmailAndPassword(auth, email, password).catch(
            (error) => {
                const message = error.message
                    .split("/")[1]
                    .slice(0, -2)
                    .replaceAll("-", " ");
                setError(message[0].toUpperCase() + message.slice(1));
            }
        );
    }
    async function signInGoogle() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential =
                    GoogleAuthProvider.credentialFromError(error);
            });
    }
    useEffect(() => {
        document.title = "Chat App | Sign In";
    }, []);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });
    }, []);
    return (
        <div className="flex flex-col gap-10 items-center justify-center h-screen ">
            <h1 className="font-bold text-4xl">Sign In</h1>
            <form
                className="flex flex-col gap-10 items-center justify-center"
                onSubmit={signInUser}
            >
                <div className="flex flex-col">
                    <label htmlFor="email" className="font-bold">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                        }
                        className="text-black px-5 py-2 rounded-xl"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="font-bold">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                        }
                        className="text-black px-5 py-2 rounded-xl"
                    />
                </div>

                <button
                    type="submit"
                    className="px-5 py-2 bg-green-500 text-black rounded-md cursor-pointer font-bold hover:scale-110 transition"
                >
                    Sign In!
                </button>
            </form>

            <p className="text-red-600 font-bold">{error ?? ""}</p>
            <button
                onClick={signInGoogle}
                className="flex gap-10 items-center justify-center bg-white px-5 py-2 text-black rounded-xl font-bold hover:scale-110 transition"
            >
                <img
                    src="/images/google-color-svgrepo-com.svg"
                    className="w-8"
                />
                Sign In With Google
                <img
                    src="/images/google-color-svgrepo-com.svg"
                    className="w-8"
                />
            </button>
            <Link to="/signup" className="text-sky-300 underline">
                Don't have an account?
            </Link>
        </div>
    );
}

export default SignIn;
