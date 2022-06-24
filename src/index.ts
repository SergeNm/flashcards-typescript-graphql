import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import { context } from "./context";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";


export const server = new ApolloServer({
  schema,
  context,
  introspection: true,                                     
  plugins: [ApolloServerPluginLandingPageLocalDefault()],  
});

const port = process.env.PORT || 3000; 

server.listen({ port }).then(({ url }) => {
  console.log("🚀 ~ server start and listen ~", { url });
});
