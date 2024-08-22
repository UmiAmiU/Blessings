import { useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { init } from "../../store/start";
import Main from "../Main";
import Spectator from "../Spectator";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const App = () => {
  useEffect(() => {
    init();
  }, []);
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/game/:gameId" element={<Spectator />} />
          <Route path="/spectate/:spectateId" element={<Spectator />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};