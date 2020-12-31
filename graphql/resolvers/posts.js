const Post = require('../../models/Post')
const {validatePostInput} = require('../../util/validators')
const checkAuth = require('../../util/check-auth')

module.exports = {
  Query:{
    async getPosts() {
      try{
        const posts = await Post.find();
        return posts;
      }
      catch(err){
        throw new Error(err);
      }
    },

    async getPost(_,{postId}) {
      try{
        const post = await Post.findById(postId).sort({createdAt: -1});
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

      // console.log('Post saved ', post)
      return post
    },

    async deletePost(_,{postId}) {

    }

  }

}
