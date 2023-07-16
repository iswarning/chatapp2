// import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./login";
import { ReactElement, ReactNode, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.css";
import { auth, db, getMessagingToken } from "@/firebase";
import Loading from "@/components/Loading";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { NextPage } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "../node_modules/@fortawesome/fontawesome-svg-core/styles.css";
import requestPermission from "@/utils/requestPermission";
import { wrapper } from "../redux/store";
import { Provider } from "react-redux";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Layout from "@/components/Layout/Layout";
import { createNewUser } from "@/services/UserService";
import { setUserInfo } from "@/services/CacheService";
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

  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT,
    cache: new InMemoryCache()
  });

  useEffect(() => {
    if (user) {
      requestPermission();

      // getMessagingToken()
      // .then((token) => {
      //   createNewUser({
      //     email: user?.email!,
      //     fullName: user?.displayName!,
      //     fcmToken: token
      //   })
      // })
      // .catch((err) => console.log(err));
    }
  }, [user]);

  if (!user) return <Login />;

  if (loading) return <Loading />;

  return <ApolloProvider client={client}><Provider store={store}>
    <Layout>
      <Component {...props.pageProps} />
      <ToastContainer />   
    </Layout>
  </Provider></ApolloProvider>
}
