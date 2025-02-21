// import Navbar from "../../../components/navigation/navbar/Navbar";
// import styles from "./landing.module.css";
// import { RegularButton } from "../../../components/buttons";
import { Navigate } from "react-router-dom";
function Landing() {
  // const userData = true;
  const userData = JSON.parse(localStorage.getItem("data_user_main"));
  if (!userData) {
    return <Navigate to="/register" />;
  } else {
    return <Navigate to="/dashboard" />;
  }

  // return (
  //   <div>
  //     <Navbar />
  //     <div className={styles.hero_section}>
  //       <div className={styles.hero_section_inner}>
  //         <h1>
  //           The #1 Rated <span>SMS Marketing</span> Service
  //         </h1>
  //         <p>
  //           Create valuable connections with your customers through targeted,
  //           action-driving text messages, marketing campaigns, two-way SMS
  //           chats, reminders, notifications, and internal staff communication.{" "}
  //         </p>
  //         <div className={styles.button_flex}>
  //           <RegularButton title={"Get Started"} />
  //           <button>View Pricing</button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default Landing;
