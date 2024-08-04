import { useRouteError, useNavigate } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div id="error-page" style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>Oops!</h1>
        <button onClick={handleGoHome} style={styles.button}>
          Go to Home
        </button>
      </div>
      <p style={styles.message}>Sorry! Some unexpected error has occurred</p>
      <p style={styles.errorDetails}>
        <i>{error?.statusText || error?.message}</i>
      </p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "2rem",
    maxWidth: "600px",
    margin: "0 auto",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem", // Space between heading and button
  },
  heading: {
    fontSize: "4rem",
    color: "#d9534f", // Red color for emphasis
    marginBottom: "1rem", // Space below the heading
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1.5rem",
    color: "#fff",
    backgroundColor: "#0275d8", // Blue color for the button
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    outline: "none",
  },
  message: {
    fontSize: "1.5rem",
    color: "#333",
    marginTop: "1rem",
  },
  errorDetails: {
    fontSize: "1rem",
    color: "#666",
    marginTop: "1rem",
  },
};

export default ErrorPage;
