import React from 'react'
import { Card, Image } from 'semantic-ui-react'
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
        <div className="ui labeled button" tabIndex="0" onClick={likePost}>
          <div className="ui teal button basic" >
            <i className="heart icon"></i> Like
          </div>
          <a className="ui basic teal left pointing label">
            {likeCount}
          </a>
        </div>

        <div className="ui labeled button" tabIndex="0" onClick={commentOnPost}>
          <div className="ui blue button basic" >
            <i className="comment icon"></i> Like
          </div>
          <a className="ui basic blue left pointing label">
            {commentCount}
          </a>
        </div>
      </Card.Content>
    </Card>
  )
}
