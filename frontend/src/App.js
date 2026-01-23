import React from "react";
import Rotas from "./routes/Rotas";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>     
        <Rotas />     
    </ThemeProvider>
  );
}

export default App;
