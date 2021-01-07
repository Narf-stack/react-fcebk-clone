import React, {useContext} from 'react'
import { Card, Image,Button } from 'semantic-ui-react'
import moment from 'moment'
import {Link} from 'react-router-dom'

import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import {AuthContext} from '../context/auth'
import MyPopup from '../utils/MyPopup'


export default function PostCard({post:{id, body, createdAt, username, likeCount, commentCount, likes}}){

  const {user} = useContext(AuthContext)



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
        <LikeButton post={{id, likes, likeCount}} user={user}/>
        <MyPopup
          content='Comment this post'
          >
            <Button className="ui labeled button" tabIndex="0" as={Link} to={`/posts/${id}`}>
              <div className="ui blue button basic" >
                <i className="comment icon"></i> Comment
              </div>
              <div className="ui basic blue left pointing label">
                {commentCount}
              </div>
            </Button>

        </MyPopup>


        {user && user.username === username && <DeleteButton postId={id}/> }
      </Card.Content>
    </Card>
  )
}
