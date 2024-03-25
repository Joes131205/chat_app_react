import { getAuth, onAuthStateChanged } from "firebase/auth";

import app from "../firebase";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

function Root() {
    const auth = getAuth();
    const navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/signup");
            }
        });
    }, []);
    return (
        <div>
            <h1>Chat App</h1>
        </div>
    );
}

export default Root;
