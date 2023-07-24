import {ApolloServer, gql} from "apollo-server";
import fetch from "node-fetch";

const typeDefs = gql`
    # Query
    type Query {
        allStations: [Station!]!
    }
    type Station {
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
        async allStations() {
            const apiUrl1 =
              "http://openapi.seoul.go.kr:8088/77447a58706c617237364d6a694774/json/bikeList/1/1000/";
            const apiUrl2 =
              "http://openapi.seoul.go.kr:8088/77447a58706c617237364d6a694774/json/bikeList/1001/2000/";
            const apiUrl3 =
              "http://openapi.seoul.go.kr:8088/77447a58706c617237364d6a694774/json/bikeList/2001/3000/";

            try {
                const response1 = await fetch(apiUrl1);
                const data1 = await response1.json();
                const stations1 = data1.rentBikeStatus.row;

                const response2 = await fetch(apiUrl2);
                const data2 = await response2.json();
                const stations2 = data2.rentBikeStatus.row;

                const response3 = await fetch(apiUrl3);
                const data3 = await response3.json();
                const stations3 = data3.rentBikeStatus.row;

                const allStations = [...stations1, ...stations2, ...stations3];

                return allStations;
            } catch (error) {
                console.error("Error fetching data from API:", error);
                throw new Error("Failed to fetch data from API");
            }
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
