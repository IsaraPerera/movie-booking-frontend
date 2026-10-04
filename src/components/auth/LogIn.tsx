import { ChangeEvent, useState } from "react";
import { SignIn } from "../../models/SignIn";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService";

export const LogIn = () => {
    const [signIn, setSignIn] = useState<SignIn>({
        email: "",
        password: "",
    })

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSignIn((prev) => ({ ...prev, [name]: value }))
    }
    const handleReset = () => {
        setSignIn({
            email: "",
            password: "",
        })
    }

    const { login } = useAuth()
    const navigate = useNavigate()
    // FIX: handleOnSubmit had no try/catch, so any rejected promise from
    // AuthService.signIn (CORS block, wrong credentials, server down,
    // timeout — anything) was an unhandled rejection that crashed straight
    // to React's red runtime-error overlay instead of showing the user
    // something they can act on.
    const [error, setError] = useState<string | null>(null)

    const handleOnSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError(null)
        try {
            const token = await AuthService.signIn(signIn)
            login(token)
            handleReset()
            // FIX: previously always navigated to /users, an admin-only route —
            // a plain customer logging in would land on a page they can't use.
            navigate("/movies")
        } catch (err: any) {
            if (err.message === "Network Error") {
                setError("Can't reach the server. Please check your connection and try again.")
            } else {
                setError(err.response?.data?.errorDescription || "Invalid email or password.")
            }
        }
    }

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    {/* FIX: was "Login to EcoCheck-2026" — leftover naming from
                        the course template this project was copied from. */}
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-blue-400">Login to Movie Booking</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {error && (
                        <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/40 px-3 py-2 text-sm text-red-400">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleOnSubmit}>

                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-blue-400">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={signIn.email}
                                    onChange={handleOnChange}
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm/6 font-medium text-blue-400">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={signIn.password}
                                    onChange={handleOnChange}
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 mb-4"
                            >
                                Login
                            </button>
                            <button
                                type="reset"
                                className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
};