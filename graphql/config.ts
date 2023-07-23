import { ApolloClient, InMemoryCache, HttpLink, split, ApolloLink } from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/link-error';

const wsLink =
typeof window !== "undefined"
    ? new GraphQLWsLink(
            createClient({
                url: process.env.NEXT_PUBLIC_GRAPHQL_SUB_ENPOINT!,
            })
      )
    : null;

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT,
});

const link =
typeof window !== "undefined" && wsLink != null
    ? split(
            ({ query }) => {
                const def = getMainDefinition(query);
                return (
                    def.kind === "OperationDefinition" &&
                    def.operation === "subscription"
                );
            },
            wsLink,
            httpLink
      )
    : httpLink;


const ApolloConfig = new ApolloClient({
  link: ApolloLink.from([
      onError(({
          graphQLErrors,
          networkError
      }) => {
          if (graphQLErrors) {
              graphQLErrors.map(({
                      message,
                      locations,
                      path
                  }) =>
                  console.log(
                      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                  )
              );
          }
          if (networkError) {
              console.log(`[Network error]: ${networkError}`);
          }
      }),
      link,
  ]),
  cache: new InMemoryCache()
});

export default ApolloConfig
