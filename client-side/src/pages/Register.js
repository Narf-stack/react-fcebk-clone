import React, {useContext, useState}  from 'react'
import {Form, Button} from 'semantic-ui-react'
import {useMutation} from '@apollo/react-hooks'

import {useForm} from '../utils/hooks'
import REGISTER_USER from '../graphql-tools/mutationRegister'
import {AuthContext} from '../context/auth'


export default function Register(props){
  const [errors, setErrors] = useState({})
  const context = useContext(AuthContext)

  const {onChange, onSubmit, values} = useForm(registerUser,{
    username: '',
    email:'',
    password:'',
    confirmPassword:''
  })



  const [addUser, {loading}] = useMutation(REGISTER_USER,{
    update(proxy, result){
      // console.log(result)
      context.login(result.data.register)
      props.history.push('/')  // redirect to home page once registr
    },onError(err){
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
      // console.log(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values
  })

  function registerUser(){
    addUser();
  }

  return(
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading': ''}>
        <h1>Register</h1>
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
          label='Email'
          placeholder='Email'
          type='email'
          name='email'
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}

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

        <Form.Input
          label='Confirm Password'
          placeholder='Confirm password..'
          name='confirmPassword'
          type='password'
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword ? true : false}

        />
        <Button type='submit' primary>
          Register
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


