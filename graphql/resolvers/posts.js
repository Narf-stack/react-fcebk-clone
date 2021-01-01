const {AuthentificationError} = require('apollo-server')


const Post = require('../../models/Post')
const {validatePostInput} = require('../../util/validators')
const checkAuth = require('../../util/check-auth')

module.exports = {
  Query:{
    async getPosts() {
      try{
        const posts = await Post.find().sort({createdAt: -1});
        return posts;
      }
      catch(err){
        throw new Error(err);
      }
    },

    async getPost(_,{postId}) {
      try{
        const post = await Post.findById(postId);
        //  -1 = sort descending
        if(post){
          return post;
        } else{
          throw new Error('Post not found')
        }
      }
      catch(err){
        throw new Error(err);
      }
    }
  },

  Mutation:{
    async createPost(_,{body},context){
      // console.log(context)
      const user = checkAuth(context)
      // console.log('User',user)

      const {valid, errors} = validatePostInput(body)
      // console.log(valid)
      if(!valid){
        throw new Error(errors)
      }

      const newPost = new Post({
        body:body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });
      // console.log('new Post', newPost)
      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
              newPost: post
            });
      // console.log('Post saved ', post)
      return post
    },

    async deletePost(_,{postId},context) {
      const user = checkAuth(context)

      try {
        const post = await Post.findById(postId)

        if ( user.username === post.username){
          await post.delete();
          return 'Post deleted successfully'
        } else {
          throw new AuthentificationError('Action not allowed')
        }
      } catch(err){
        throw new Error(err)
      }
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  }
}
