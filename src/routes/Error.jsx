import { Link } from "react-router-dom";

function Error() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-5">
            <h1 className="font-bold text-6xl">404</h1>
            <p>
                <b>Dang! What happened 💀</b>
            </p>
            <Link
                to="/"
                className="px-5 py-2 bg-red-500 text-black rounded-md cursor-pointer font-bold hover:scale-110 transition"
            >
                Go Back
            </Link>
        </div>
    );
}

export default Error;
