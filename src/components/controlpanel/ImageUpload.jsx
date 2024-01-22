import { useState } from 'react'
import { connect } from 'react-redux'
import { newMessage } from '../../reducers/messageReducer'
import imageService from '../../services/images'
import { Header, Form, Button, Segment, Dimmer, Loader } from 'semantic-ui-react'
import './custombutton.css'

const ImageUpload = (props) => {
    const [ photo, setPhoto ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ name, setName ] = useState('')
    const [ filename, setFilename ] = useState('Select file')
    const [ isLoading, setIsLoading ] = useState(false)

    const handleImageUpload = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        const formData = new FormData()
        formData.append('photo', photo)
        formData.append('name', name)
        formData.append('description', description)
        formData.append('user', props.userinfo.user._id)
        imageService.setToken(props.userinfo.token)
        try {
            const response = await imageService.uploadNew(formData)
            if (response.status === 201) {
                props.newMessage('Image uploaded successfully', 'green')
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error.message)
            props.newMessage('Something went wrong', 'red')
            setIsLoading(false)
        }
        setPhoto('')
        setName('')
        setDescription('')
        setFilename('')
    }

    const onFileChange = (event) => {
        setPhoto(event.target.files[0])
        const str = event.target.value.split('\\').pop()
        setFilename(str)
    }

    const handleDescription = (event) => {
        setDescription(event.target.value)
    }

    const handleName = (event) => {
        setName(event.target.value)
    }

    return (
        <Segment padded color='olive'>
            <Header as='h3'>Upload Images</Header>
            <Form onSubmit={handleImageUpload}>
                <Form.Field>
                    <label>Name: </label>
                    <input name="name" value={name} type="text" onChange={handleName} />
                </Form.Field>
                <Form.TextArea label='Description of the image:' name="description" value={description} type="text" onChange={handleDescription}/>  
                <Form.Field>
                    <input type="file" name="photo" id="upload-image-01" className="inputfile" onChange={onFileChange} />
                    <label htmlFor="upload-image-01">{filename}</label>
                </Form.Field>
                { isLoading ? 
                    <Dimmer active inverted><Loader>Loading...</Loader></Dimmer>
                    :
                    <Button type="submit">Upload image</Button>
                }
            </Form>
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
    newMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageUpload)