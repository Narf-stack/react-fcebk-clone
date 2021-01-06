import React,{useContext} from 'react'
import {useQuery} from '@apollo/react-hooks'
import { Grid, Transition } from 'semantic-ui-react'

import PostCard from '../components/PostCard'
import {AuthContext} from '../context/auth'
import PostForm from '../components/PostForm'
import {FETCH_POSTS_QUERY} from '../utils/graphql'

export default function Home(){
  const {user} = useContext(AuthContext)
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
      {user &&
        <Grid.Column>
          <PostForm/>
        </Grid.Column>}
      {loading ? (
        <h1>Loading posts</h1>
        ): (
        <Transition.Group>
          {posts.length !==0 ? (posts.map(post =>(
            <Grid.Column key={post.id} style={{marginBottom: 20}}>
              <PostCard post={post}/>
            </Grid.Column>
            ))) : null}
        </Transition.Group>
        )
      }
      </Grid.Row>
  </Grid>
  )
}

