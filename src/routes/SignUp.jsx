import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";
import { useState } from "react";

const auth = getAuth();
function SignUp() {
    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
    });
    return (
        <div>
            <h1>Sign Up</h1>
            <form>
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
            </form>
        </div>
    );
}

export default SignUp;
