import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/header.css";
import "../App.css";
import logo from "../assets/Innvoket.png";

const Header = () => {
  const [navVisible, setNavVisible] = useState(false);
  const location = useLocation(); // Get the current route

  const toggleNav = () => {
    setNavVisible(!navVisible);
  };

  return (
    <div
      style={{
        padding: "1rem 1rem",
        background: "black",
        color: "white",
        width: "100vw",
        height: "15vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      <div className="logo">
        <img src={logo} width={"160px"} height={"80px"} alt="logo" />
      </div>
      <div className="nav-toggle material-symbols-outlined" onClick={toggleNav}>
        menu
      </div>
      <nav className={navVisible ? "parkinsans-font show" : "parkinsans-font"}>
        <span
          className="close-btn material-symbols-outlined"
          onClick={toggleNav}
        >
          close
        </span>
        <Link
          to="/"
          onClick={() => setNavVisible(false)}
          className={location.pathname === "/" ? "active-tab" : ""}
        >
          <p>Home</p>
        </Link>
        <Link
          to="/users"
          onClick={() => setNavVisible(false)}
          className={location.pathname === "/users" ? "active-tab" : ""}
        >
          <p>Users</p>
        </Link>
        <Link
          to="/tasks"
          onClick={() => setNavVisible(false)}
          className={location.pathname === "/tasks" ? "active-tab" : ""}
        >
          <p>Tasks</p>
        </Link>
      </nav>
    </div>
  );
};

export default Header;
