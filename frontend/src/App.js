import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Rotas from "./routes/Rotas";
import Layout from "./layout/Layout";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>     
        <Rotas />     
    </ThemeProvider>
  );
}

export default App;
