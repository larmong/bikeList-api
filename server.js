import {ApolloServer, gql} from "apollo-server";
import fetch from "node-fetch"

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
`

const resolvers = {
    Query: {
        allBikeList(){
            return fetch("http://openapi.seoul.go.kr:8088/77447a58706c617237364d6a694774/json/bikeList/1/1000/")
              .then((res) => res.json())
              .then((json) => json.rentBikeStatus.row);
        },
    },

}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true
});

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
