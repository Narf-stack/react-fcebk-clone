import React, {useState}  from 'react'
import {Form, Button} from 'semantic-ui-react'
import {useMutation} from '@apollo/react-hooks'
// import { onError } from "apollo-link-error";

import {useForm} from '../utils/hooks'
import LOGIN_USER from '../graphql-tools/mutationLogin'


export default function Login(props){
  const [errors, setErrors] = useState({})
  const {onChange, onSubmit, values} = useForm(loginUserCallback,{
    username: '',
    password:''
  })

  const [loginUser, {loading}] = useMutation(LOGIN_USER,{
    update(proxy, result){
      props.history.push('/')  // redirect to home page once registr
    },onError(err,networkError){
      const errors = err.networkError.result.errors.map(err=>{
        return err.message
      })
      setErrors(errors);
      // setErrors(err.networkError.result.errors);
      // setErrors(err.graphQLErrors[0].extensions.exception.errors);
      // setErrors(err&&err.graphQLErrors[0]?err.graphQLErrors[0].extensions.exception.errors:{});
      // console.log(err.networkError.result.errors)
    },
    variables: values
  })

  function loginUserCallback(){
    loginUser();
  }

  return(
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading': ''}>
        <h1>Login</h1>
        <Form.Input
          label='Username'
          placeholder='Username'
          name='username'
          type='text'
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
        />

        <Form.Input
          label='Password'
          placeholder='Password...'
          name='password'
          type='password'
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}

        />


        <Button type='submit' primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0  && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map((value) =>(
              <li key={value}>{value}</li>
              )
            )}
          </ul>
        </div>
        )}
    </div>
  )
}


