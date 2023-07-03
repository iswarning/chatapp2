import Navbar from './Navbar';
import Footer from './Footer';
import Header from './Header';
 
export default function Layout({ children }: any) {

  return (
    <>
      <Header />
      <Navbar />
      {children}
    </>
  );
}