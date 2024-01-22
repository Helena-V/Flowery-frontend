import { useState } from 'react'
import userService from '../services/users'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { newMessage } from '../reducers/messageReducer'
import { setUser } from '../reducers/userReducer'
import { Modal, Header, Form, Button } from 'semantic-ui-react'


const NewUser = (props) => {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ name, setName ] = useState('')


    const handleNewUser = async (event) => {
        event.preventDefault()
        const user = {
            name: name,
            username: username,
            password: password
        }
        setUsername('')
        setPassword('')
        setName('')
        try {
         const created = await userService.createNew(user)
          props.newMessage(`created new user ${user.name}`, 'green')
          props.history.push('/controlpanel')
          props.setUser(created)
        } catch (error) {
          console.log(error.message)
          props.newMessage(`Something went wrong: ${error.message}`, 'red')
    
        }
      }

    return (
        <Modal.Content>
            <Header as='h3'>Create a new user:</Header>
            <Form onSubmit={handleNewUser}>
                <Form.Group>
                    <Form.Field>
                        <label>Username:</label>
                        <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
                    </Form.Field>
                    <Form.Field>
                        <label>Name:</label>
                        <input type="text" value={name} onChange={({ target }) => setName(target.value)} />
                    </Form.Field>
                    <Form.Field>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
                    </Form.Field>
                </Form.Group>
                <Button inverted color='olive' type="submit">Submit</Button>
            </Form>
        </Modal.Content>
    )
}

const mapStateToProps = (state) => {
    return {
        userinfo: state.userinfo,
        messages: state.messages
    }
}

const mapDispatchToProps = {
    newMessage,
    setUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewUser))