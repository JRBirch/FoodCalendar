import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./shared_layout/AppLayout";
import Home from "./pages/Home";
import FoodList from "./pages/FoodList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="foodlist" element={<FoodList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
