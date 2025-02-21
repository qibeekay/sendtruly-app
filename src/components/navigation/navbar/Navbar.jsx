import styles from "./navbar.module.css";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <div className={styles.nav_container}>
      <div className={styles.nav_inner}>
        <img src={logo} alt="" />

        <ul className={styles.nav_middle}>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>Solution</li>
          <li>Pricing</li>
          <li>Api</li>
        </ul>
        <div className={styles.nav_right}>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/register">
            {" "}
            <button>Get Started</button>{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
