import React, {useState} from 'react'
import {Button, Icon,Confirm} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {FETCH_POSTS_QUERY} from '../utils/graphql'
import MyPopup from '../utils/MyPopup'

export default function DeleteButton({postId, commentId, callback}){
  // console.log(commentId)
  const [confirmOpen, setConfirmOpen] =useState(false)
  const [ errors,setErrors] = useState({})
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION
  const val = commentId ? 'comment' : 'post'
  // console.log(mutation)
  const [deletePostOrCommMutation] = useMutation(mutation,{
    update(proxy){
      setConfirmOpen(false)
      if(!commentId){
        // Remove post from cache
        const data = proxy.readQuery({
          query:FETCH_POSTS_QUERY
        })
        // console.log(proxy)
        data.getPosts = data.getPosts.filter(p => p.id !== postId)
        proxy.writeQuery({query: FETCH_POSTS_QUERY, data })
      }
      // Go back to home page
      if(callback) callback();
    },onError(err,networkError){
      // const errors = err.networkError.result.errors.map(err=>{
      //   return err.message
      // })
      setErrors(err&&err.graphQLErrors[0]?err.graphQLErrors[0].extensions.exception.errors:{});
      // console.log(err.networkError.result.errors)
    },
    variables:{postId, commentId}
  })

  return(
    <>
      <MyPopup
        content={commentId? "Delete this comment": "Delete this post"}
        >
          <Button as="div" color="red" floated='right' onClick={()=>setConfirmOpen(true)}>
            <Icon name='trash' style={{margin:0}} />
          </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={()=>setConfirmOpen(false)}
        onConfirm={deletePostOrCommMutation}
      />
    </>
  )
}


const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId:ID!){
    deletePost(postId:$postId)
  }
`
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId:ID!, $commentId:ID!){
    deleteComment(postId:$postId, commentId:$commentId){
      id
      comments{
        id username createdAt body
      }
      commentCount
    }
  }
`
