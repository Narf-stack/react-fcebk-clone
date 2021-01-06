import React,{useState} from 'react'
import {Button, Form} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'

import {FETCH_POSTS_QUERY} from '../utils/graphql'
import {useForm} from '../utils/hooks'


export default function PostForm(){

  const {values, onChange, onSubmit } = useForm(createPostCallback,{
    body:''
  });

  const [errors, setErrors] = useState({})


  const [createPost, {error}] = useMutation(CREATE_POST_MUTATION,{
    variables: values,
    update(proxy,result){
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      })
      data.getPosts = [result.data.createPost, ...data.getPosts]
      proxy.writeQuery({query: FETCH_POSTS_QUERY, data})
      console.log(proxy)
      values.body = ''
    },onError(err,networkError){
      // console.log(err.graphQLErrors[0])
      setErrors(err&&err.graphQLErrors[0]?err.graphQLErrors[0].extensions.exception.errors:{});
    },
  })

  function createPostCallback(){
    createPost()
  }
  return(
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post: </h2>
        <Form.Field>
          <Form.Input
            placeholder='Tell us someting new ...'
            type='text'
            value={values.body}
            name='body'
            onChange={onChange}
            error={error ? true : false}
          />
          <Button type='submit' color='teal'>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  )
}


const CREATE_POST_MUTATION =gql `
  mutation createPost($body:String!){
    createPost(body: $body){
      id body createdAt username
      likes{
        username id createdAt
      }
      likeCount
      comments{
        id body username createdAt
      }
      commentCount
    }
  }

`
