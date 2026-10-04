import { ChangeEvent, useState } from "react";
import { User, UserRole } from "../../models/User";
import { useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService";
import { useAuth } from "./AuthProvider";

export const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<User>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: UserRole.CUSTOMER // Default to CUSTOMER
  });

  const handleReset = () => {
    setUser({
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: UserRole.CUSTOMER
    });
  };

  // Handles both input and select elements
  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const token = await AuthService.signUp(user);
      if (token) {
        login(token);
        handleReset();
        navigate("/movies");
      }
    } catch (err: any) {
      if (err.message === "Network Error") {
        setError("Can't reach the server. Please check your connection and try again.");
      } else {
        setError(err.response?.data?.errorDescription || "Sign up failed. Please try again.");
      }
    }
  };

  const inputClass =
    "block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6";
  const labelClass = "block text-sm/6 font-medium text-blue-600";

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-blue-600">
          Register for Movie Booking
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/40 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleOnSubmit}>
          <div>
            <label htmlFor="firstName" className={labelClass}>First Name</label>
            <div className="mt-2">
              <input id="firstName" name="firstName" type="text" value={user.firstName}
                onChange={handleOnChange} required className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className={labelClass}>Last Name</label>
            <div className="mt-2">
              <input id="lastName" name="lastName" type="text" value={user.lastName}
                onChange={handleOnChange} required className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <div className="mt-2">
              <input id="email" name="email" type="email" value={user.email}
                onChange={handleOnChange} required className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <div className="mt-2">
              <input id="password" name="password" type="password" value={user.password}
                onChange={handleOnChange} required className={inputClass} />
            </div>
          </div>

          {/* Role selection */}
          <div>
            <label htmlFor="role" className={labelClass}>Role</label>
            <div className="mt-2">
              <select id="role" name="role" value={user.role}
                onChange={handleOnChange} required className={inputClass}>
                <option value={UserRole.CUSTOMER}>CUSTOMER</option>
                <option value={UserRole.ADMIN}>ADMIN</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-green-400 mb-4"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-red-800"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};