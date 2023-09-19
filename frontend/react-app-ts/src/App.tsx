import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./shared_layouts/AppLayout";
import Home from "./pages/Home/Home";
import { FoodList } from "./pages/FoodList/FoodList";
import { LoginScreen } from "./pages/Login/Login";
import RegisterScreen from "./pages/Register/Register";
import ProtectedRoutes from "./shared_layouts/ProtectedRoutes";
import FoodCalendar from "./pages/Calendar/FoodCalendar";
import { NotFound } from "./pages/NotFound/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<RegisterScreen />} />
          <Route path="login" element={<LoginScreen />} />
          <Route path="" element={<ProtectedRoutes />}>
            <Route path="calendar" element={<FoodCalendar />} />
            <Route path="foodlist/:date" element={<FoodList />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
