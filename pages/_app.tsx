// import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./login";
import { ReactElement, ReactNode, useEffect } from "react";
import createNewUser from "@/utils/createNewUser";
// import "bootstrap/dist/css/bootstrap.css";
import { auth, getMessagingToken, onMessageListener } from "@/firebase";
import Loading from "@/components/Loading";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { NextPage } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "../node_modules/@fortawesome/fontawesome-svg-core/styles.css";
import requestPermission from "@/utils/requestPermission";
import { io } from "socket.io-client";
import { wrapper } from "../redux/store";
import { Provider } from "react-redux";
import Layout from "@/components/Layout/Layout";
config.autoAddCss = false;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, ...rest }: AppPropsWithLayout) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      requestPermission();

      getMessagingToken()
      .then((token) => {
        createNewUser(user, token).catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

      const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
      socket.emit("login", { userId: user?.email });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  // useEffect(() => {
  //     const channel = new BroadcastChannel("notifications");
  //     channel.addEventListener("message", (event) => {
  //       console.log(event.data);
  //     });
  // },[])

  useEffect(() => {
    onMessageListener()
      .then((data: any) => {
        toast(`${data.notification.body}`, {
          hideProgressBar: true,
          autoClose: 5000,
          type: "info",
        });
      })
      .catch((err) => console.log(err));
  });

  if (!user) return <Login />;

  if (loading) return <Loading />;

  return <Provider store={store}>
    <Layout>
      <Component {...props.pageProps} />
      <ToastContainer />   
    </Layout>
  </Provider>
}
