import React, {useContext, useRef,useState} from 'react'
import gql from 'graphql-tag'
import {useQuery, useMutation} from '@apollo/react-hooks'
import moment from 'moment'
import {Button, Card, Grid, Image, Icon, Label, Form} from 'semantic-ui-react'

import {AuthContext} from '../context/auth'
import DeleteButton from '../components/DeleteButton'
import LikeButton from '../components/LikeButton'
import MyPopup from '../utils/MyPopup'


export default function SinglePost(props){

  function deletePostCallback(){
    props.history.push('/')
  }

  let postId = props.match.params.postID
  // console.log(postId)
  const [comment, setCom] = useState('')
  const [ errors,setErrors] = useState({})
  const {user} = useContext(AuthContext)
  const commentInputRef = useRef(null)
  const { data,error} = useQuery(FETCH_POST_QUERY, {
    variables:{
      postId: postId
    }
  })
  // console.log(data)
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION,{
      update(proxy){
        setCom('')
        commentInputRef.current.blur()

      },onError(err,networkError){

        setErrors(err&&err.graphQLErrors[0]?err.graphQLErrors[0].extensions.exception.errors:{});
      },
      variables:{postId, body: comment}
    })

  if(error) {
    console.log(error);
    return "error"; // blocks rendering
  }


  let postMarkup;
  if(!data){
    postMarkup = <p>Loading ...</p>
  } else{
    const {id, body, createdAt, username, comments, likes, likeCount, commentCount} = data.getPost

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated='right'
              size='small'
              src='https://react.semantic-ui.com/images/avatar/large/matthew.png'
              />
          </Grid.Column>

          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{id, likeCount, likes}}/>
                <MyPopup
                  content={commentCount === 0 ? "Why so quiet ?"
                        : commentCount === 1 ? "Follow the lead, there is only one comment here"
                        : "Things are getting serious here, join the group"}
                >
                  <Button as="div" labelPosition='right'
                    onClick={()=> console.log('Comment on post')}>

                    <Button basic colo='blue'>
                      <Icon name='comments'/>
                    </Button>

                    <Label basic color='blue' pointing='left'>
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>

                {user && user.username === username && (
                    <DeleteButton postId={id} callback={deletePostCallback}/>
                  )}
              </Card.Content>
            </Card>
            {user &&(
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type='text'
                        placeholder='Comment ...'
                        name='comment'
                        value={comment}
                        onChange={event => setCom(event.target.value)}
                        ref={commentInputRef}
                      />
                      <Button type='submit' className='ui button teal'
                        disabled={comment.trim()===''}
                        onClick={submitComment}
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(comment =>(
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                   <DeleteButton postId={id} commentId={comment.id} />
                    )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            )
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return(
    postMarkup
  )
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body:String!) {
    createComment(postId: $postId, body:$body) {
      id
      commentCount
      comments{
        id username createdAt body
      }
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id body createdAt username likeCount
      likes {
        username
      }
      commentCount
      comments{
        id username createdAt body
      }
    }
  }
`;
