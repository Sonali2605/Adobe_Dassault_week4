import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto'; // Import chart.js auto bundle

// Importing category scale from Chart.js
import { CategoryScale, LinearScale, Title } from 'chart.js';

// Registering the category and linear scales
Chart.register(CategoryScale, LinearScale, Title);

// Sample data for two years (24 months)
const sampleData = [
  { quarter: "Q1", months: ["Jan", "Feb", "Mar"], values: [5000, 4500, 4500, 10000, 6000, 5000, 4500, 4500, 10000, 6000, 5000, 4500] },
  { quarter: "Q2", months: ["Apr", "May", "Jun"], values: [4500, 4500, 10000, 6000, 5000, 4500] },
  { quarter: "Q3", months: ["Jul", "Aug", "Sep"], values: [4500, 10000, 6000, 5000, 4500, 4500] },
  { quarter: "Q4", months: ["Oct", "Nov", "Dec"], values: [10000, 6000, 5000, 4500, 4500, 10000, 6000] }
];

// Calculate the average of all values for each month
const avgData = sampleData.flatMap(({ quarter, months, values }) =>
  months.map((month, index) => ({
    quarter,
    month,
    value: values[index * 2] + values[index * 2 + 1]
  }))
);

// Reduce yellow graph values by half
const reducedYellowData = avgData.map(({ quarter, month, value }) => ({
  quarter,
  month,
  value: quarter === "Q1" ? value * 0.25 : value * 0.5
}));

const data = {
  labels: reducedYellowData.map(({ month }) => month),
  datasets: [
    {
      label: "Average Dollar Value",
      data: reducedYellowData.map(({ value }) => value),
      fill: true,
      backgroundColor: "rgba(255, 255, 0, 0.2)", // Yellow with transparency
      borderColor: "rgba(255, 255, 0, 1)", // Yellow
      pointRadius: 5
    },
    {
      label: "Additional Data",
      data: avgData.slice(0, 5).map(({ value }) => value), // Data till May
      fill: true,
      backgroundColor: "rgba(0, 0, 255, 0.2)", // Blue with transparency
      borderColor: "rgba(0, 0, 255, 1)", // Blue
      pointRadius: 5
    }
  ]
};

const quarterLabels = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"];

const options = {
  scales: {
    x: {
      title: {
        display: true,
        align: "start" // Align title to the start
      },
      grid: {
        display: true,
        color: "rgba(0, 0, 0, 0.2)", // Grey horizontal lines
        drawBorder: false,
        drawOnChartArea: false,
        drawTicks: false,
      },
      ticks: {
        callback: (index: number) => {
          if (index === 1) return quarterLabels[0];
          if (index === 4) return quarterLabels[1];
          if (index === 7) return quarterLabels[2];
          if (index === 10) return quarterLabels[3];
          return '';
        }
      }
    },
    y: {
      display: false,
      beginAtZero: true
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (context:any) => {
          const month = context.label;
          const monthData = reducedYellowData.filter(({ month: m }) => m === month);
          if (monthData.length > 0) {
            const { value } = monthData[0];
            return `${month.substring(0, 3)}: $${value}`;
          }
          return `${month.substring(0, 3)}`;
        }
      }
    },
    legend: {
      display: true,
      position: 'top' // Set the position to "top"
    }
  },
  layout: {
    padding: {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20
    }
  }
};

const LineChart = () => {
  return (
    <div className="App max-w-lg"> {/* Adjust width here */}
      <div className="bg-white p-4 pb-6 rounded-md shadow-lg">
        <h3 className="text-l font-bold">Performance Graph</h3>
        <Line data={data} options={options as any} />
      </div>
    </div>
  );
};

export default LineChart;
