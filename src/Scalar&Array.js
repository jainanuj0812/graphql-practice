import { GraphQLServer } from 'graphql-yoga';

/* const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`;

const resolvers = {
    Query: {
        hello() {
            return 'This is my first query'
        },
        name() {
            return 'Anuj Jain'
        },
        location() {
            return 'Pune'
        },
        bio() {
            return 'Funny'
        }
    }
} */

/* const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`

const resolvers = {
    Query: {
        title() {
            return "Test"
        },
        price() {
            return 1.34
        },
        releaseYear() {
            return null
        },
        rating() {
            return 1.3
        },
        inStock() {
            return false
        }
    }
}
 */

const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(numbers: [Float]!): Float!
        post: Post!
        grades: [Int!]!
        me: User!
    }

    type Post {
        id: ID!
        title: String!
        body: String
        published: Boolean!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
`

const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            console.log(parent, args, ctx, info)
            if (args.name && args.position) {
                return `Hello ${args.name} and position is ${args.position}`
            } else {
                return `Hello!`
            }
        },
        add(parent, args, ctx, info) {
            if(args.numbers.length == 0) {
                return 0
            }
            return args.numbers.reduce((accVal, currVal) => {
                return accVal + currVal
            })
        },
        grades() {
            return [2, 5,8]
        },
        me() {
            return {
                id: "zeew",
                name: "Anuj Jain",
                email: "anuj.jain@asaasas.com"
            }
        },
        post() {
            return {
                id: "123",
                title: "ABC",
                published: false
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers
});

server.start(() => {
    console.log('server is up');
})