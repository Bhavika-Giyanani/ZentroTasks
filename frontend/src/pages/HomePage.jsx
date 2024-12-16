import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import "../styles/home_styles.css";
const HomePage = () => {
  return (
    <div className="stats-container">
      <h1 className="parkinsans-font" style={{ textAlign: "center" }}>
        Task Statistics
      </h1>
      <div className="charts-container">
        <div className="chart1">
          <PieChart />
        </div>
        <div className="chart2">
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
