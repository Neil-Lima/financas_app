import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Rotas from "./routes/Rotas";
import Layout from "./layout/Layout";
import { ThemeProvider } from "./shared/contexts/ThemeContext";
import "./shared/utils/ChartConfig";
import "./App.css";

function App() {
  return (
    <ThemeProvider>     
        <Rotas />     
    </ThemeProvider>
  );
}

export default App;
