import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import app from "../firebase";

const auth = getAuth();
function SignIn() {
    return (
        <div>
            <h1>Sign In</h1>
        </div>
    );
}

export default SignIn;
