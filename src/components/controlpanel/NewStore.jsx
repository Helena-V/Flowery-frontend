import { useState } from 'react'
import { connect } from 'react-redux'
import { newMessage } from '../../reducers/messageReducer'
import { newStore } from '../../reducers/storesReducer'
import { updateUser } from '../../reducers/userReducer'
import { Form, Button, Header, Segment } from 'semantic-ui-react'

const NewStore = (props) => {
    const [ name, setName ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ location, setLocation ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ webPage, setWebPage ] = useState('')
    const [ phone, setPhone ] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        const newStore = {
            name: name,
            owner: props.userinfo.user._id,
            description: description,
            location: location,
            email: email,
            webpage: webPage,
            phone: phone
        }
        try {
            await props.newStore(newStore, props.userinfo.token)
            props.newMessage(`New store "${newStore.name}" created`, 'green')
            await props.updateUser(props.userinfo)
        } catch (error) {
            console.log(error.message)
            props.newMessage(`Something went wrong: ${error.message}`, 'red')
        }
        setName('')
        setDescription('')
        setLocation('')
        setEmail('')
        setWebPage('')
        setPhone('')
    }

    return (
        <Segment padded color='olive'>
            <Header as='h3'>Create New Store here</Header>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Field>
                        <label>Name:</label>
                        <input value={name} onChange={({ target }) => setName(target.value)}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Location:</label>
                        <input value={location} onChange={({ target }) => setLocation(target.value)}/>
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Field>
                        <label>Contact email:</label>
                        <input value={email} onChange={({ target }) => setEmail(target.value)}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Phone:</label>
                        <input value={phone} onChange={({ target }) => setPhone(target.value)}/>
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Field>
                        <label>Webpage:</label>
                        <input value={webPage} onChange={({ target }) => setWebPage(target.value)}/>
                    </Form.Field>
                    <Form.TextArea label='Description of the store' value={description} onChange={({ target }) => setDescription(target.value)} />
                </Form.Group>
                <Button type="submit">Create</Button>
            </Form>
        </Segment>
    )
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages,
        userinfo: state.userinfo,
    }
}

const mapDispatchToProps = {
    newMessage,
    newStore,
    updateUser
}

export default connect(mapStateToProps, mapDispatchToProps)(NewStore)