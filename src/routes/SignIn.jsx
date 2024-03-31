import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "firebase/auth";

import app from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignIn() {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const auth = getAuth();
    async function signInUser(e) {
        e.preventDefault();
        const { email, password } = data;
        await signInWithEmailAndPassword(auth, email, password).catch(
            (error) => {
                alert(error.message);
            }
        );
    }
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });
    }, []);
    return (
        <div className="flex flex-col gap-10 items-center justify-center h-screen ">
            <h1>Sign In</h1>
            <form
                className="flex flex-col gap-10 items-center justify-center"
                onSubmit={signInUser}
            >
                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                        }
                        className="text-black"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                        }
                        className="text-black"
                    />
                </div>

                <button type="submit">Sign In</button>
            </form>
            <Link to="/signup">Don't have an account?</Link>
        </div>
    );
}

export default SignIn;
