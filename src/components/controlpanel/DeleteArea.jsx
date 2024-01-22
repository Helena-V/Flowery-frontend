import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { newMessage } from '../../reducers/messageReducer'
import { logoutUser } from '../../reducers/userReducer'
import { resetStateOfStore } from '../../reducers/individualStoreReducer'
import { deleteStoreCreatedByUser } from '../../reducers/userReducer'
import userService from '../../services/users'
import { Segment, Container, Header, Form, Button } from 'semantic-ui-react'

const DeleteArea = (props) => {
    const [ selectedStore, setSelectedStore ] = useState(undefined)

    const handleDeleteAccount = async () => {
        if (window.confirm(`Delete account permanently for ${props.userinfo.user.name}?`)) {
            try {
                userService.setToken(props.userinfo.token)
                const response = await userService.deleteUserAccount(props.userinfo.user._id)
                if (response.status === 200) {
                    props.resetStateOfStore()
                    props.logoutUser()
                    props.history.push('/')
                    props.newMessage(`Account deleted successfully`, 'green')
                }
            } catch (error) {
                console.log(error.message)
                props.newMessage(`Something went wrong: ${error.message}`, 'red')
            }
        }
    }


    const handleStoreRemoval = async (event) => {
        event.preventDefault()
        const chosen = props.userinfo.user.stores.find(store => store.name === selectedStore)
        if (window.confirm(`Do you want to permanently delete store ${chosen.name}?`)) {
            try {
                await props.deleteStoreCreatedByUser(props.userinfo, chosen._id)
                props.newMessage(`Store deleted successfully`, 'green')
            } catch (error) {
                console.log(error.message)
                props.newMessage(`Something went wrong: ${error.message}`, 'red')
            }
        }
        setSelectedStore('')
    }

    if (props.userinfo.user.stores.length < 1) {
        return (
            <Segment secondary padded color='red'>
            <Header as='h3'>Delete account</Header>
            <Container>
                <p>Warning! Removing an account deletes all the data!</p>
                <Button onClick={handleDeleteAccount}>delete user account</Button>
            </Container>
            </Segment>            
        )
    }

    return (
        <Segment secondary padded color='red'>
            <Header as='h3'>Delete account</Header>
            <Container>
                <p>Warning! Removing an account deletes all the data!</p>
                <Button onClick={handleDeleteAccount}>Delete user account</Button>
            </Container>
            <Header as='h3'>Delete a store</Header>
            <Container>
                <Form onSubmit={handleStoreRemoval}>
                    <Form.Field control='select' value={selectedStore} onChange={({ target }) => setSelectedStore(target.value)}>
                        <option key=""></option>
                        {props.userinfo.user.stores.map(store => <option key={store._id}>{store.name}</option>)}
                    </Form.Field>
                    <Button type="submit">Remove store</Button>
                </Form>
            </Container>
        </Segment>
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
    logoutUser,
    resetStateOfStore,
    deleteStoreCreatedByUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeleteArea))