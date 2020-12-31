const {AuthentificationError,UserInputError} = require('apollo-server')


const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')
// const {validateCommentInput} = require('../../util/validators')




module.exports = {
  Mutation:{
    async createComment(_,{postId,body},context) {
      try{
        const {username} = checkAuth(context);

        // const {valid, errors} = validateCommentInput(body);
        if(body.trim()===''){
          throw new UserInputError('empty comment',{
            errors:{
              body:'Comment must not be empty'
            }
          })
        }

        const post = await Post.findById(postId);

        if(post){
          post.comments.unshift({
            body,
            username,
            createdAt: new Date().toISOString()
          });
          await post.save();

          return post
        } else{
          throw new UserInputError('Post not found')
        }
      }
      catch(err){
        throw new Error(err);
      }
    },
    async deleteComment(_,{postId,commentId},context) {
      // console.log(postId)

      try{
        const {username} = checkAuth(context);

        // console.log(username)

        const post = await Post.findById(postId);
        if(post){
          const commentIndex =post.comments.findIndex((c) => c.id === commentId)
          const comment = post.comments[commentIndex]

          if(comment.username === username){
            // console(comment)
            post.comments.splice(commentIndex,1);
            await post.save()
            // console.log(post)

            return post
          }else{
            throw new AuthentificationError('Action not allowed')
          }
        } else{
          throw new UserInputError('Post not found')
        }
      }
      catch(err){
        throw new Error(err);
      }
    }
  }
}
