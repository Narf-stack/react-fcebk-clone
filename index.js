const {ApolloServer,PubSub } = require('apollo-server');
const gql = require('graphql-tag')
const mongoose = require('mongoose');
const { MONGODB } = require('./config.js')
const resolvers = require('./graphql/resolvers/index')
const typeDefs = require('./graphql/typeDefs')

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:({req})=>({req,pubsub})
});

mongoose.connect(MONGODB,{useNewUrlParser:true})
  .then(()=> {
    console.log('MongoDB connected')
    return server.listen({port: PORT})
  })
  .then(res => {
    console.log(`server running at ${res.url}`)
  })
  .catch(err =>{
    console.error(err)
  })

