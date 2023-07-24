import { ApolloServer, gql } from "apollo-server";
import cors from "cors";
import fetch from "node-fetch";

const typeDefs = gql`
    # Query
    type Query {
        allBikeList: [bikeList!]!
    }
    type bikeList {
        rackTotCnt: String!
        stationName: String!
        parkingBikeTotCnt: String!
        shared: String!
        stationLatitude: String!
        stationLongitude: String!
        stationId: String!
    }
`;

const resolvers = {
    Query: {
        allBikeList() {
            return fetch("http://openapi.seoul.go.kr:8088/77447a58706c617237364d6a694774/json/bikeList/1/1000/")
              .then((res) => res.json())
              .then((json) => json.rentBikeStatus.row);
        },
    },
};

const app = express();

// CORS 설정
const allowedOrigins = [
    "https://bike-finder-larmong.netlify.app",
    "http://localhost:3000",
];
app.use(
  cors({
      origin: function (origin, callback) {
          if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
          } else {
              callback(new Error("Not allowed by CORS"));
          }
      },
      credentials: true,
  })
);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
});

server.applyMiddleware({ app });

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
});
