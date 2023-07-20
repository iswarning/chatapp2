// import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./login";
import { ReactElement, ReactNode, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.css";
import { auth } from "@/firebase";
import Loading from "@/components/Loading";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { NextPage } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "../node_modules/@fortawesome/fontawesome-svg-core/styles.css";
import requestPermission from "@/utils/requestPermission";
import { wrapper } from "../redux/store";
import { Provider } from "react-redux";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, split, ApolloLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
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

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT
  });
  
  const wsLink = () => {
    return new GraphQLWsLink(createClient({
      url: 'ws://localhost:5000/graphql'
    }));
  }
  
  const client = new ApolloClient({
      link: typeof window === 'undefined' ? httpLink : wsLink(),
      cache: new InMemoryCache(),
  });
  

  // const httpLink = new HttpLink({
  //   uri: process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT
  // })

  // const link = split(
  //   ({ query }) => {
  //     const definition = getMainDefinition(query);
  //     return (
  //       definition.kind === 'OperationDefinition' &&
  //       definition.operation === 'subscription'
  //     )
  //   },
  //   wsLink,
  //   httpLink
  // )

  // const subClient = new ApolloClient({
  //   uri: process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT,
  //   cache: new InMemoryCache(),
  //   link
  // });

  if(typeof window != "undefined") {
    window.addEventListener("dragover",function(e){
      e = e || event;
      e.preventDefault();
    },false);
    window.addEventListener("drop",function(e){
      e = e || event;
      e.preventDefault();
    },false);
  }

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
