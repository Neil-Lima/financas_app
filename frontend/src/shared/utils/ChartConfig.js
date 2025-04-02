import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// Registrar todos os componentes necessários do Chart.js
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement, // Elemento necessário para Line charts
  LineElement,  // Elemento necessário para Line charts
  Title,
  Tooltip,
  Legend,
  Filler
);

// Configuração para resolver problema de canvas já em uso
ChartJS.defaults.set('plugins.id', 'chartjs-plugin-id');
ChartJS.defaults.set('plugins.destroy', true);

export default ChartJS; 