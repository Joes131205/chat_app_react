function SideBar(props) {
    return (
        <div className="flex gap-2 items-center ">
            <img
                src={props.profilePicture}
                alt="Profile Picture"
                className="rounded-full w-10 h-10 border-2 border-black"
            />
            <p>
                Hello, <span className="font-bold">{props.username}</span>!
            </p>
        </div>
    );
}

export default SideBar;
