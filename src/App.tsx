import Header from "../Components/Header";
import Hero from "../Components/Hero";
import Products from "../Components/Products";
import Popular from "../Components/Popular";
import Best from "../Components/Best";
import Hook from "../Components/Hook";
import Footer from "../Components/Footer";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <Header />
        <Hero />
        <Products />
        <Best />
        <Popular />
        <Hook />
        <Footer />
      </div>
    </div>
  );
}

export default App;
