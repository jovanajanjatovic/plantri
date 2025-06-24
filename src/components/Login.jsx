import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                    Sign in to <span className="text-blue-600">Plantri</span>
                </h1>

                <button
                    onClick={handleLogin}
                    className="group h-12 w-full px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
                >
                    <div className="relative flex items-center justify-center">
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google logo"
                            className="absolute left-4 w-5"
                        />
                        <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-white group-hover:text-blue-600">
                            Continue with Google
                        </span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Login;