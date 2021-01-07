import React, {useState} from 'react'
import {Button, Icon,Confirm} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {FETCH_POSTS_QUERY} from '../utils/graphql'


export default function DeleteButton({postId, callback}){
  // console.log(postId)
  const [confirmOpen, setConfirmOpen] =useState(false)
  const [ errors,setErrors] = useState({})
  const [deletePost] = useMutation(DELETE_POST_MUTATION,{
    update(proxy){
      setConfirmOpen(false)
      // Remove post from cache
      const data = proxy.readQuery({
        query:FETCH_POSTS_QUERY
      })
      // console.log(proxy)
      data.getPosts = data.getPosts.filter(p => p.id !== postId)
      proxy.writeQuery({query: FETCH_POSTS_QUERY, data })
      // Go back to home page
      if(callback) callback();
    },onError(err,networkError){
      // const errors = err.networkError.result.errors.map(err=>{
      //   return err.message
      // })
      setErrors(err&&err.graphQLErrors[0]?err.graphQLErrors[0].extensions.exception.errors:{});
      // console.log(err.networkError.result.errors)
    },
    variables:{postId}
  })

  return(
    <>
      <Button as="div" color="red" floated='right' onClick={()=>setConfirmOpen(true)}>
        <Icon name='trash' style={{margin:0}} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={()=>setConfirmOpen(false)}
        onConfirm={deletePost}
      />
    </>
  )
}


const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId:ID!){
    deletePost(postId:$postId)
  }
`
