import React from "react";
import "./SplashScreen.css"; // 👈 Importás los keyframes

const SplashScreen: React.FC = () => {
  return (
    <div style={styles.container}>
      <img
        src="/img/logo-gym-active-png.png"
        alt="Gym Logo"
        style={styles.logo}
      />
      <div style={styles.progressContainer}>
        <div style={styles.progressBar} />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "180px",
    marginBottom: "40px",
    // animation: "pulse 2s infinite", // 👈 Este nombre coincide con el del CSS
  },
  progressContainer: {
    width: "200px",
    height: "10px",
    backgroundColor: "#444",
    borderRadius: "5px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    width: "100%",
    backgroundColor: "#8e2de2",
    animation: "loadbar 1s linear forwards", // 👈 Este también
  },
};

export default SplashScreen;
