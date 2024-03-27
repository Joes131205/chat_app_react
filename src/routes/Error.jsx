import { useRouteError } from "react-router-dom";

function Error() {
    const error = useRouteError();

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-5">
            <h1 className="font-bold text-4xl">404</h1>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}

export default Error;
