import { NavLink } from "react-router-dom";
import { FaCar, FaTools, FaBell } from "react-icons/fa";
import "./NavigationBar.css";

const NavigationBar = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className="nav-icon">
        <FaCar />
        <span>Vozila</span>
      </NavLink>
      <NavLink to="/services" className="nav-icon">
        <FaTools />
        <span>Servisi</span>
      </NavLink>
      <NavLink to="/reminders" className="nav-icon">
        <FaBell />
        <span>Podsetnici</span>
      </NavLink>
    </nav>
  );
};

export default NavigationBar;
