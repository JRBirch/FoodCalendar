import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
// import Navbar from "./Navbar";
import AppLayout from './AppLayout';
import Home from "./Home";
import FoodList from "./FoodList";


function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<AppLayout/>}>
        <Route index element={<Home/>} />
        <Route path="foodlist" element={<FoodList/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App
