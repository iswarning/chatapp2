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
    // <div className="w-full h-screen">
    //     <div className="flex h-full">
    //       {/* Menu Left */}
    //       
    //       <div className="flex-1 w-full h-full">
    //           <div className="main-body container w-11/12 h-full flex flex-col" style={{marginLeft: '20%'}}>
    //             {/* <h1>{data[0]?.userId}</h1> */}
    //             
    //             
    //             {/* Body */}
    //             
    //           </div>
    //       </div>
    //       {/* Footer */}
    //       <Footer />
    //   </div>
    // </div>
  );
}