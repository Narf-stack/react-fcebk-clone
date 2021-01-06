import React, {useContext} from 'react'
import { Card, Image,Button,Icon } from 'semantic-ui-react'
import moment from 'moment'
import {Link} from 'react-router-dom'

import LikeButton from './LikeButton'
import {AuthContext} from '../context/auth'

export default function PostCard({post:{id, body, createdAt, username, likeCount, commentCount, likes}}){

  const {user} = useContext(AuthContext)

  function likePost(){
    console.log('like post')
  }


  return (
    <Card fluid >
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/matthew.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton post={{id, likes, likeCount, likePost}} user={user}/>

        <Button className="ui labeled button" tabIndex="0" as={Link} to={`/posts/${id}`}>
          <div className="ui blue button basic" >
            <i className="comment icon"></i> Comment
          </div>
          <div className="ui basic blue left pointing label">
            {commentCount}
          </div>
        </Button>

        {user && user.username === username && (
          <Button as="div" color="red" floated='right' onClick={()=> console.log('Delete')}>
            <Icon name='trash' style={{margin:0}} />
          </Button>


          )}
      </Card.Content>
    </Card>
  )
}
