import styles from "./buttons.module.css";

export const RegularButton = ({title}) => {
  return <button className={styles.button}>{title}</button>;
};
