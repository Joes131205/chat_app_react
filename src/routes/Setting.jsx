import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
    getFirestore,
    setDoc,
    doc,
    getDoc,
    collection,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import app from "../firebase";

function Setting() {
    const [data, setData] = useState({
        changeUserName: "",
        changeProfilePicture: "",
        profilePictureReview: "",
    });
    const auth = getAuth();
    const storage = getStorage();
    const db = getFirestore();

    const navigate = useNavigate();

    async function changeProfilePicture(image) {
        const storageRef = ref(storage, `profile-pictures/${image.name}`);
        await uploadBytes(storageRef, image);
    }

    async function changeUsername(username) {
        console.log("changing username");
        try {
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                username,
            });
        } catch (error) {
            console.log(error);
        }
    }

    function changeData(e) {
        const { name, value } = e.target;
        if (name === "changeProfilePicture") {
            const file = e.target.files[0];
            if (file) {
                // Handles Image Preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setData((prev) => ({
                        ...prev,
                        profilePictureReview: reader.result,
                    }));
                };

                // Handles Image Naming for Upload
                const newFilename = `${auth.currentUser.uid}.${file.name
                    .split(".")
                    .pop()}`;
                const newBlob = new Blob([file], {
                    type: file.type,
                });

                newBlob.name = newFilename;
                setData((prev) => ({
                    ...prev,
                    changeProfilePicture: newBlob,
                }));
                reader.readAsDataURL(file);
            }
        } else {
            setData({ ...data, [name]: value });
        }
    }

    async function changeSetting(e) {
        e.preventDefault();
        if (!data.changeUserName && !data.changeProfilePicture) {
            return;
        }
        if (data.changeUserName) {
            await changeUsername(data.changeUserName);
        }
        if (data.changeProfilePicture) {
            await changeProfilePicture(data.changeProfilePicture);
        }
        navigate("/");
    }

    async function fetchUserName(uid) {
        const db = getFirestore(app);
        const usersCollection = await collection(db, "users");
        const docRef = doc(usersCollection, uid);
        const docSnap = await getDoc(docRef);
        const username = await docSnap.data().username;
        setData((prev) => ({ ...prev, changeUserName: username }));
    }

    async function fetchProfilePicture(uid) {
        const storage = getStorage();
        const profilePictureRef = ref(storage, `profile-pictures/${uid}.png`);
        const snap = await getDownloadURL(profilePictureRef);
        setData((prev) => ({ ...prev, profilePictureReview: snap }));
    }

    useEffect(() => {
        document.title = "Chat App | Setting";
    }, []);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                await fetchUserName(uid);
                await fetchProfilePicture(uid);
            } else {
                navigate("/signup");
            }
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-10 h-screen">
            <h1 className="font-bold text-4xl">Setting</h1>

            <form
                className="flex flex-col items-center justify-center gap-10"
                onSubmit={changeSetting}
            >
                <div className="flex flex-col gap-2 items-center justify-center">
                    <label htmlFor="changeUserName" className="font-bold">
                        Change Username
                    </label>
                    <input
                        type="text"
                        name="changeUserName"
                        id="changeUserName"
                        value={data.changeUserName}
                        className="border-2 border-black text-black px-5 py-2 rounded-xl"
                        onChange={changeData}
                    />
                </div>

                <div className="flex flex-col gap-2 items-center justify-center">
                    <label htmlFor="changeProfilePicture" className="font-bold">
                        Change Profile Picture (Accepts PNG)
                    </label>
                    <input
                        type="file"
                        name="changeProfilePicture"
                        id="changeProfilePicture"
                        accept="image/png, image/jpg"
                        onChange={changeData}
                    />
                    <img
                        src={
                            data.profilePictureReview ||
                            "/images/placeholder.png"
                        }
                        alt="Profile Picture"
                        className="rounded-full w-24 h-24 border-2 border-black "
                    />
                </div>

                <input
                    type="submit"
                    value="Submit"
                    className="px-5 py-2 bg-green-500 text-black rounded-md cursor-pointer font-bold hover:scale-110 transition"
                />
            </form>
            <Link
                to="/"
                className="px-5 py-2 bg-red-500 text-black rounded-md cursor-pointer font-bold hover:scale-110 transition"
            >
                Go back
            </Link>
        </div>
    );
}

export default Setting;
