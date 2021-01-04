import React from 'react'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Grid } from 'semantic-ui-react'

import PostCard from '../components/PostCard'



export default function Home(){
  // const {loading,
    // data: {getPosts: posts} } = useQuery(FETCH_POSTS_QUERY)
    let posts =[]
    const { data, loading, error } = useQuery(FETCH_POSTS_QUERY);
    // console.log(useQuery(FETCH_POSTS_QUERY))
    if(data) {
      // console.log(data);
      // const { getPosts } = data;
      const { getPosts: postz } = data;
      posts = postz
    }
      // console.log("post",posts.length)
    if(error) {
      console.log(error);
      return "error"; // blocks rendering
    }
  return(
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
      {loading ? (
        <h1>Loading posts</h1>
        ): (
        posts.length !==0 ? (posts.map(post =>(
          <Grid.Column key={post.id} style={{marginBottom: 20}}>
            <PostCard post={post}/>
          </Grid.Column>
          ))) : null
        )
      }
      </Grid.Row>
  </Grid>
  )
}

const FETCH_POSTS_QUERY = gql `
  {
    getPosts{
      id body createdAt username likeCount
      likes{username}
      commentCount
      comments{
        id username createdAt body
      }
    }
  }
`
