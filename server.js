import { ApolloServer, gql } from "apollo-server";
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
        async allBikeList() {
            try {
                // 서울시 공공 데이터 API 엔드포인트
                const apiUrl = "http://openapi.seoul.go.kr:8088/77447a58706c617237364d6a694774/json/bikeList/1/1000/";

                // 프록시 설정을 위한 옵션
                const proxyOptions = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                };

                // 프록시 요청 보내기
                const response = await fetch(apiUrl, proxyOptions);
                const json = await response.json();
                return json.rentBikeStatus.row;
            } catch (error) {
                console.error("프록시 요청 오류:", error);
                throw new Error("서버에서 데이터를 가져오는 중에 오류가 발생했습니다.");
            }
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    cors: {
        origin: 'https://bike-finder-app-56767ec70f0a.herokuapp.com/',
    },
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
