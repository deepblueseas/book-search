const typeDefs = `

type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
}
    
input BookInput {
  bookId: String!
  authors: [String]
  description: String
  title: String!
  image: String
  link: String
}


type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
    user(username: String!): User

}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookInput: BookInput!): User
    removeBook(bookId: String!): User
}



`;

module.exports = typeDefs;

