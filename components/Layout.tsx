import Navbar from './Navbar';
import Footer from './Footer';
import Header from './Header';
 
export default function Layout({ children }: any) {
  return (
    <div className="w-full h-screen">
        <div className="flex h-full">
          {/* Menu Left */}
          <Navbar />
          <div className="flex-1 bg-gray-100 w-full h-full">
              <div className="main-body container m-auto w-11/12 h-full flex flex-col">
                {/* Header */}
                <Header />
                {/* Body */}
                {children}
              </div>
          </div>
          {/* Footer */}
          <Footer />
      </div>
    </div>
  );
}