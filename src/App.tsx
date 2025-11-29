import { Outlet, Route, Routes } from "react-router-dom";

import { ToastProvider } from "@heroui/toast";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Products from "./pages/products";
import { Navbar } from "./components/navbar";
import BreadCrumb from "./components/BreadCrumb";

 
function AuthenticatedLayout() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 lg:pl-64">
        <div className="w-full h-full px-4 sm:px-2 lg:px-6 xl:px-2 py-6 lg:py-2">
          <div className="w-full mx-auto mb-4">
           <BreadCrumb />
           </div>
           <div className="w-full mx-auto mt-4">
                <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
}

 
 

function App() {
  return (
    <>
      <ToastProvider placement="top-right"/>
      <Routes>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<Products />} />
          <Route path="/sales/cart" element={<Cart />} />
          <Route path="/sales/checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
