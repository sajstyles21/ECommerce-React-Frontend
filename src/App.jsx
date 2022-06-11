import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = lazy(() => import("./pages/Product"));
const Home = lazy(() => import("./pages/Home"));
const ProductList = lazy(() => import("./pages/ProductList"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Cart = lazy(() => import("./pages/Cart"));

const App = () => {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>
      <ToastContainer />
      <Router>
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/products/:category" element={<ProductList />}></Route>
            <Route path="/product/:id" element={<Product />}></Route>
            <Route path="/cart" element={<Cart />}></Route>
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            ></Route>
            <Route
              path="/register"
              element={user ? <Navigate to="/" /> : <Register />}
            ></Route>
            <Route
              path="/logout"
              element={!user ? <Navigate to="/" /> : <Home />}
            ></Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  );
};

export default App;
