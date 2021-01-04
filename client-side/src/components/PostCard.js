import React from 'react'
import { Card,Icon, Label, Image, Button } from 'semantic-ui-react'
import moment from 'moment'
import {Link} from 'react-router-dom'




export default function PostCard({post:{id, body, createdAt, username, likeCount, commentCount, likes}}){
  function likePost(){
    console.log('like post')
  }

  function commentOnPost(){
    console.log('Comment post')
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
        <div class="ui labeled button" tabindex="0" onClick={likePost}>
          <div class="ui teal button basic" >
            <i class="heart icon"></i> Like
          </div>
          <a class="ui basic teal left pointing label">
            {likeCount}
          </a>
        </div>

        <div class="ui labeled button" tabindex="0" onClick={commentOnPost}>
          <div class="ui blue button basic" >
            <i class="comment icon"></i> Like
          </div>
          <a class="ui basic blue left pointing label">
            {commentCount}
          </a>
        </div>
      </Card.Content>
    </Card>
  )
}
