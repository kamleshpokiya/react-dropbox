import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Auth from "./pages/auth";
import { useReducer } from "react";
import { UserContext, UserReducer, initialState } from "state/index";

function App() {
  const [auth, dispatch] = useReducer(UserReducer, initialState);

  const isAuth = Boolean(auth.token);

  return (
    <div className="app">
      <BrowserRouter>
        <UserContext.Provider value={{auth,dispatch}}>
          <Routes>
            <Route path="/" element={isAuth ? <Home /> : <Auth />} />
            <Route
              path="/home"
              element={isAuth ? <Home /> : <Navigate to="/" />}
            />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;