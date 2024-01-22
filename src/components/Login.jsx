import { useState } from 'react'
import loginService from '../services/login'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { newMessage } from '../reducers/messageReducer'
import { setUser } from '../reducers/userReducer'
import { Form, Button, Dimmer, Loader } from 'semantic-ui-react'

const Login = (props) => {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ isLoading, setIsLoading ] = useState(false)
  
  const handleLogin = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const response = await loginService.login({
        username, password
      })
      setUsername('')
      setPassword('')
      setIsLoading(false)
      props.newMessage('Login success', 'green')
      props.history.push('/controlpanel')
      props.setUser(response)
    } catch (error) {
      console.log(error.message)
      setUsername('')
      setPassword('')
      setIsLoading(false)
      if (error.message.includes(401)) {
        props.newMessage('Wrong credentials - please try again or create a new account', 'red')
      } else {
        props.newMessage(`Something went wrong: ${error.message}`, 'red')
      }
    }
  }

  if (isLoading) {
    return (
      <Dimmer active inverted>
        <Loader>Loading...</Loader>
      </Dimmer>  
    )
  }
  
  
      return (
        <Form onSubmit={handleLogin}>
          <Form.Group inline>
            <Form.Field>
              <input placeholder="Username" type="text" value={username} data-cy="login-username" onChange={({ target }) => setUsername(target.value)} />
            </Form.Field>
            <Form.Field>
              <input placeholder="Password" type="password" value={password} data-cy="login-password" onChange={({ target }) => setPassword(target.value)} />
            </Form.Field>
            <Button inverted color='olive' type="submit" data-cy="login-submit-button">Log in</Button>
          </Form.Group>
        </Form>
      )
  }


  const mapStateToProps = (state) => {
    return {
      messages: state.messages,
      userinfo: state.userinfo,
      allStores: state.allStores
    }
  }
  
  const mapDispatchToProps = {
    setUser,
    newMessage
  }
  
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
