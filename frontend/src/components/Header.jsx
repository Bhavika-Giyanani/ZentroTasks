import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/header.css";
import "../App.css";

const Header = () => {
  const [navVisible, setNavVisible] = useState(false);
  const location = useLocation();

  const toggleNav = () => {
    setNavVisible(!navVisible);
  };

  return (
    <div
      style={{
        paddingLeft: "1rem",
        background: "black",
        color: "white",
        width: "100vw",
        height: "15vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        overflowX: "hidden",
        overflowY: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div className="logo" style={{ 
        flex: "1", 
        display: "flex", 
        alignItems: "center",
        minWidth: "0"
      }}>
        <img
          src={"/ZentroTasks.svg"}
          style={{
            height: "40px",
            width: "auto",
            maxWidth: "100%",
            objectFit: "contain"
          }}
          alt="ZentroTasks Logo"
        />
      </div>
      
      {/*^ Desktop Navigation */}
      <nav 
        className="parkinsans-font desktop-nav"
        style={{
          display: "none",
          gap: "2rem",
          alignItems: "center"
        }}
      >
        <Link
          to="/"
          className={location.pathname === "/" ? "active-tab" : ""}
        >
          <p>Home</p>
        </Link>
        <Link
          to="/users"
          className={location.pathname === "/users" ? "active-tab" : ""}
        >
          <p>Users</p>
        </Link>
        <Link
          to="/tasks"
          className={location.pathname === "/tasks" ? "active-tab" : ""}
        >
          <p>Tasks</p>
        </Link>
      </nav>
      
      {/*^ Mobile Menu Icon */}
      <div 
        className="nav-toggle material-symbols-outlined" 
        onClick={toggleNav}
        style={{
          fontSize: "2rem",
          cursor: "pointer",
          padding: "0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "1rem",
          flexShrink: 0
        }}
      >
        menu
      </div>
      
      {/*^ Mobile Navigation - overlay menu */}
      <nav className={navVisible ? "parkinsans-font mobile-nav show" : "parkinsans-font mobile-nav"}>
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