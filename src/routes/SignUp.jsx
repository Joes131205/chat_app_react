import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";

import app from "../firebase";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

function SignUp() {
    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const auth = getAuth();
    const navigate = useNavigate();

    function signUpUser(e) {
        e.preventDefault();
        if (data.password === data.confirmPassword) {
            const { email, password } = data;
            createUserWithEmailAndPassword(auth, email, password).then(
                (userCredential) => {
                    const user = userCredential.user;
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
        <div className="flex flex-col gap-10 items-center justify-center">
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
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default SignUp;
