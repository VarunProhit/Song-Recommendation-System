import React from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AOS from "aos";
import "aos/dist/aos.css";
import "./style.scss";

const code = new URLSearchParams(window.location.search).get("code");

const App = () => {
	AOS.init();
	return code ? <Dashboard code={code} /> : <Login />;
};

export default App;
