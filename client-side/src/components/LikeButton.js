import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {Button, Icon} from 'semantic-ui-react'
import MyPopup from '../utils/MyPopup'


export default function LikeButton({user, post:{id, likes, likeCount}}){
  const [liked, setLiked] = useState(false)
  useEffect(()=>{
    if(user && likes.find(like => like.username === user.username)){
      setLiked(true)
    } else {
      setLiked(false)
    }
  }, [user,likes])

  const [likePost] = useMutation(LIKE_POST_MUTATION,{
    variables:{postId:id}
  })

  const likeButton = user ? (
    liked ?(
      <Button color="teal" >
        <Icon name="heart"/>
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart"/>
      </Button>
    )
    ):(
      <Button as={Link} to='/' color="teal" basic>
        <Icon name="heart"/>
      </Button>
  )

  return(
    <MyPopup
      content={liked? 'Unlike this post' : 'Like this post'}
      >
      <div className="ui labeled button" tabIndex="0" onClick={likePost}>
        {likeButton}
        <div className="ui basic teal left pointing label">
          {likeCount}
        </div>
      </div>
    </MyPopup>
  )
}




const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;
