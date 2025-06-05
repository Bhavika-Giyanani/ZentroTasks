import "../App.css";

const Footer = () => {
  const year = new Date();

  return (
    <footer className="parkinsans-font">
      <p>&copy; ZentroTasks {year.getFullYear()}</p>
    </footer>
  );
};

export default Footer;
