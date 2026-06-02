import value from 'assets/scss/_themes-vars.module.scss';

// Function to dynamically generate `n` distinct colors using HSL
const generateColors = (n) => {
  return Array.from({ length: n }, (_, i) => `hsl(${(i * 360) / n}, 70%, 50%)`);
};

// Function to group data by field (e.g., doctor)
const groupByField = (data) => {
  return data.reduce((acc, item) => {
    const field = item.label; // Group by the 'label' field
    acc[field] = (acc[field] || 0) + item.value; // Sum values for each field
    return acc;
  }, {});
};

// Chart configuration function
export const chartData = (data) => {
  const groupedData = groupByField(data); // Group data by field
  const labels = Object.keys(groupedData); // Extract field names
  const values = Object.values(groupedData); // Extract total values
  const colors = generateColors(labels.length); // Generate `n` colors dynamically

  return {
    height: 228,
    type: 'donut',
    options: {
      dataLabels: {
        enabled: false
      },
      yaxis: {
        min: 0,
        max: Math.max(...values) + 10 // Dynamic max value
      },
      labels, // Use field names as labels
      legend: {
        show: true,
        position: 'bottom',
        fontFamily: 'inherit',
        labels: {
          colors: 'inherit'
        }
      },
      itemMargin: {
        horizontal: 10,
        vertical: 10
      },
      colors // Use generated colors
    },
    series: values // Use total values as series
  };
};

const inputData = [
  { label: 'Orthopedics', value: 5 },
  { label: 'Cardiology', value: 8 },
  { label: 'Neurology', value: 3 },
  { label: 'Pediatrics', value: 2 }
];

// // Usage
const chartConfig = chartData(inputData);
export default chartConfig;
