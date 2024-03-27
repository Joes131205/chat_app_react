function Setting() {
    return (
        <div>
            <h1>Setting</h1>

            <form>
                <div>
                    <label htmlFor="changeUserName">Change Username</label>
                    <input
                        type="text"
                        name="changeUserName"
                        id="changeUserName"
                    />
                </div>

                <div>
                    <label htmlFor="changeProfilePicture">
                        Change Profie Picture
                    </label>
                    <input
                        type="file"
                        name="changeProfilePicture"
                        id="changeProfilePicture"
                    />
                </div>

                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default Setting;
