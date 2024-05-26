import './App.scss';
import { Switch, Route } from 'react-router-dom';
import Home from "./components/Home";
import Addproduct from './pages/Addproduct';
import { createContext, useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Addmember from './pages/Addmember';
import Stockin from './pages/Stockin';
import Stockout from './pages/Stockout';
import Stockoutpdf from './pages/Stockoutpdf';
import Stock from './pages/Stock';
import StockOutSearch from './pages/StockOutSearch';
import StockInSearch from './pages/StockInSearch';
import Orderdetails from './pages/Orderdetails';
import Discarditem from './pages/Discarditem';
import Geneticstock from './components/stocks/Geneticstock';
import Microbiologystock from './components/stocks/Microbiologystock';
import Parasitology from './components/stocks/Parasitology';
import Generalstock from './components/stocks/Generalstock';
import Centralsection from './components/central section/Centralsection';
import Heamotolgy from './components/central section/Heamotolgy';
import Biochemistry from './components/central section/Biochemistry';
import HPLC from './components/central section/HPLC';
import AAS from './components/central section/AAS';
import Order from './pages/Order';
import Orderpdf from './components/Order/Orderpdf';
import Login from './components/login/Login';
import Departmetnlils from './components/Department list/Departmetnlils';
import Orderdetailspdf from './components/Order/Orderdetailspdf';
import ProtectedRoute from './pages/ProtectedRoute ';
import Discardpdf from './pages/Discardpdf';


export const ThemeContext = createContext();

function App() {
  const [darkMode, setDardMode] = useState(false);

  const toggleDarkMode = () => {
    setDardMode(prevMode => !prevMode);
  };

  // Define Material-UI theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <Switch>
          <Route exact path="/" component={Login} />
          <ProtectedRoute exact path="/Home" component={Home} />
          <ProtectedRoute exact path="/Addproduct" component={Addproduct} />
          <ProtectedRoute exact path="/Addmember" component={Addmember} />
          <ProtectedRoute exact path="/Stockin" component={Stockin} />
          <ProtectedRoute exact path="/Stockout" component={Stockout} />
          <ProtectedRoute exact path="/Stockoutpdf" component={Stockoutpdf} />
          <ProtectedRoute exact path="/Stock" component={Stock} />
          <ProtectedRoute exact path="/StockOutSearch" component={StockOutSearch} />
          <ProtectedRoute exact path="/StockInSearch" component={StockInSearch} />
          <ProtectedRoute exact path="/Orderdetails" component={Orderdetails} />
          <ProtectedRoute exact path="/Discarditem" component={Discarditem} />
          <ProtectedRoute exact path="/Geneticstock" component={Geneticstock} />
          <ProtectedRoute exact path="/Microbiologystock" component={Microbiologystock} />
          <ProtectedRoute exact path="/Parasitology" component={Parasitology} />
          <ProtectedRoute exact path="/Generalstock" component={Generalstock} />
          <ProtectedRoute exact path="/Centralsection" component={Centralsection} />
          <ProtectedRoute exact path="/Heamotolgy" component={Heamotolgy} />
          <ProtectedRoute exact path="/Biochemistry" component={Biochemistry} />
          <ProtectedRoute exact path="/HPLC" component={HPLC} />
          <ProtectedRoute exact path="/AAS" component={AAS} />
          <ProtectedRoute exact path="/Order" component={Order} />
          <ProtectedRoute exact path="/Orderpdf" component={Orderpdf} />
          <ProtectedRoute exact path="/Departmetnlils" component={Departmetnlils} />
          <ProtectedRoute exact path="/Orderdetailspdf" component={Orderdetailspdf} />
          <ProtectedRoute exact path="/Discardpdf" component={Discardpdf} />
        </Switch>
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}

export default App;
