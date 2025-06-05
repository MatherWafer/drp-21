import Footer from "./layout/Footer";
import Header from "./layout/Header";

export const HeaderWrapper = () => (
  <div className="absolute top-0 left-0 right-0 z-50">
    <Header />
  </div>
);

export const FooterWrapper = () => (
  <div className="absolute bottom-0 left-0 right-0 z-50">
    <Footer />
  </div>
);