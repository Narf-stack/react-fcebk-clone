const {AuthentificationError, UserInputError} = require('apollo-server')


const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')


module.exports ={
  Mutation:{
    async likePost(_,{postId}, context){
      try{
        const {username} = checkAuth(context);

        const post = await Post.findById(postId);
        if(post){
          if(post.likes.find(like=> like.username === username)){
            //  Post already liked => unlike
            post.likes = post.likes.filter(like => like.username !== username)
          } else {
            // Not liked so like it
            post.likes.push({
              username,
              createdAt: new Date().toISOString()
            })
          }
          await post.save()
          return post;
        } else {
          throw new UserInputError('Post not found')
        }
      }
      catch(err){
        throw new Error(err);
      }
    }

  }

}
