"use strict";

import { getAuth } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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

    return (
        <div>
            <h1>Setting</h1>

            <form
                className="flex flex-col items-center justify-center gap-10"
                onSubmit={changeSetting}
                onChange={changeData}
            >
                <div className="flex flex-col gap-2">
                    <label htmlFor="changeUserName">Change Username</label>
                    <input
                        type="text"
                        name="changeUserName"
                        id="changeUserName"
                        value={data.username}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="changeProfilePicture">
                        Change Profile Picture (Accepts PNG)
                    </label>
                    <input
                        type="file"
                        name="changeProfilePicture"
                        id="changeProfilePicture"
                        accept="image/png, image/jpg"
                    />
                    <img
                        src={data.profilePictureReview}
                        alt="Profile Picture"
                        className="rounded-full w-24 h-24 border-2 border-black"
                    />
                </div>

                <input type="submit" value="Submit" />
            </form>
            <Link to="/">Go back</Link>
        </div>
    );
}

export default Setting;
