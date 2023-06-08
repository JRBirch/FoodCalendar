import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./shared_layout/AppLayout";
import Home from "./pages/Home/Home";
import { FoodList } from "./pages/FoodList/FoodList";
import { LoginScreen } from "./pages/Login/Login";
import ProtectedRoutes from "./ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginScreen />} />
          <Route path="" element={<ProtectedRoutes />}>
            <Route path="foodlist" element={<FoodList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
