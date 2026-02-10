import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Login = () => {

    const { store, dispatch } = useGlobalReducer()
    const [email, SetEmail] = useState("");
    const [password, SetPassword] = useState("");
    const token = sessionStorage.getItem("token");
    console.log("This is your token", token);

    const loadMessage = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL

            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

            const response = await fetch(backendUrl + "/api/hello")
            const data = await response.json()

            if (response.ok) dispatch({ type: "set_hello", payload: data.message })

            return data

        } catch (error) {
            if (error.message) throw new Error(
                `Could not fetch the message from the backend.
                Please check if the backend is running and the backend port is public.`
            );
        }

    }

    useEffect(() => {
        loadMessage()
    }, [])

    const handleClick = () => {

        const opts = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }

        fetch('https://glorious-space-waddle-5gxgj75g7pw9f7vj5-3001.app.github.dev/api/token', opts)
            .then(resp => {
                if (resp.status === 200) return resp.json();
                else alert("There has been some error");
            })
            .then(data => {
                console.log("this came from the backend", data)
                sessionStorage.setItem("token", data.access_token)
            })
            .catch(error => {
                console.error("There was an error!!!", error);
            })


    }

    return (
        <div className="text-center mt-5">
            <h1 className="display-4">Login</h1>

            {(token && token != "" && token != undefined) ? "You are logged in with this token" + token :

                <div>
                    <input type="text" placeholder="email" value={email} onChange={(e) => SetEmail(e.target.value)} />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => SetPassword(e.target.value)} />
                    <button onClick={handleClick}>Login</button>
                </div>

            }

        </div>
    );
};

export default Login