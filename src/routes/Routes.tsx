import { Route, Routes } from "react-router-dom";
import ErrorMessage from "../pages/ErrorPage";
import Current from "../pages/Current";
import SevenDays from "../pages/SevenDays";
import FiveDays from "../pages/FiveDays";

const Router = () => {
  /* nesting routes*/
  return (
    <Routes>
      <Route path="/" element={<Current />} />
      <Route path="/next-seven-days/" element={<SevenDays />} />
      <Route path="/next-five-days/" element={<FiveDays />} />
      <Route path="*" element={<ErrorMessage />} />
    </Routes>
  );
};
export default Router;
