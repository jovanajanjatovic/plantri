import { useAuth } from "./AuthContext";
import Login from "./components/Login";
import TodoPage from "./components/TodoPage";

const App = () => {
    const { user } = useAuth();

    return user ? <TodoPage /> : <Login />;
};

export default App;