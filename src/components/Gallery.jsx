import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { newMessage } from '../reducers/messageReducer'
import { getAllProductsOfAStoreWithQuery, setStoreWithoutQuery } from '../reducers/individualStoreReducer'
import imageService from '../services/images'
import productService from '../services/products'
import storeService from '../services/stores'
import { Form, Grid, Image, Button, List, Segment, Breadcrumb, Dimmer, Loader } from 'semantic-ui-react'

const Gallery = (props) => {
    const [ images, setImages ] = useState([])
    const [ selectedImage, setSelectedImage ] = useState(undefined)
    const [ selectedStore, setSelectedStore ] = useState(undefined)
    const [ findStoreVisible, setFindStoreVisible ] = useState(false)
    const [ findProductVisible, setFindProductVisible ] = useState(false)
    const [ selectedProduct, setSelectedProduct ] = useState(undefined)
    const [ findStoreForBannerVisible, setFindStoreForBannerVisible ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const functionToLoad = async () => {
            try {
                const result = await imageService.getAllByUser(props.userinfo.user._id)
                setIsLoading(false)
                setImages(result)
            } catch (error) {
                console.log(error.message)
                setIsLoading(false)
            }
        }
        functionToLoad()
    }, [])

    console.log(props.userinfo.user)

    if (isLoading) {
        return (
            <Dimmer active inverted>
                <Loader>Loading...</Loader>
            </Dimmer>
        )
    }
    if (images.length === 0) {
        return (
            <Segment>No images added yet.</Segment>
        )
    }
    if (props.userinfo.user.stores === undefined) {
        return (
            <Segment>No stores added.</Segment>
        )
    }

    const handleDelete = async (event, image) => {
        event.preventDefault()
        try {
            imageService.setToken(props.userinfo.token)
            await imageService.deleteImage(image._id)
            const updated = images.filter(photo => !(photo._id === image._id))
            setImages(updated)
            props.newMessage(`${image.name} deleted successfully`, 'green')
        } catch (error) {
            console.log(error.message)
            props.newMessage(`Something went wrong: ${error.message}`,'red')
        }
    }

    const attachToProduct = (event, image) => {
        event.preventDefault()
        setSelectedImage(image)
        setFindStoreVisible(true)
    }

    const findStoreForm = () => {
        return (
            <List.Item>
                {props.userinfo.user.stores > 0 ?
                    <Form onSubmit={handleStoreSelection}>
                        Select the store:
                        <Form.Field control='select' value={selectedStore} onChange={({ target }) => setSelectedStore(target.value)}>
                            <option key=""> </option>
                            {props.userinfo.user.stores.map(store => <option key={store._id}>{store.name}</option>)}
                        </Form.Field>
                        <Button type="submit">Select</Button> <Button onClick={() => setFindStoreVisible(false)}>Cancel</Button>
                    </Form>
                    :
                    <p>No stores added - please create a store.</p>
                }
            </List.Item >
        )
    }

    const handleStoreSelection = async (event) => {
        event.preventDefault()
        const selected = props.userinfo.user.stores.filter(store => store.name === selectedStore)
        try {
            props.setStoreWithoutQuery(selected[0])
            await props.getAllProductsOfAStoreWithQuery(selected[0]._id)
            setFindProductVisible(true)            
        } catch (error) {
            console.log(error.message)
        }

    }

    const findProductForm = () => {
        return (
            <List.Item>
                { props.thisStore.products > 0 ? 
                <Form onSubmit={handleAttachToProduct}>
                    Select the product:
                    <Form.Field control='select' value={selectedProduct} onChange={({ target }) => setSelectedProduct(target.value)}>
                        <option key=""> </option>
                        {props.thisStore.products.map(product => <option key={product._id}>{product.name}</option>)}
                    </Form.Field>
                    <Button type="submit">Select</Button>
                </Form>
                : 
                <p>The store has no products. Please add products first.</p>
                 }
            </List.Item>
        )
    }

    const handleAttachToProduct = async (event) => {
        event.preventDefault()
        const selected = props.thisStore.products.filter(p => p.name === selectedProduct)
        selected[0].image = selectedImage._id
        try {
            productService.setToken(props.userinfo.token)
            await productService.update(selected[0])
            props.newMessage(`Image attached to product successfully`, 'green')
        } catch (error) {
            console.log(error.message)
            props.newMessage(`Something went wrong: ${error.message}`, 'red')
        }
        setSelectedImage(null)
        setSelectedStore(null)
        setFindStoreVisible(false)
        setFindProductVisible(false)
        setSelectedProduct(null) 
    }


    const attachToStore = (event, image) => {
        setSelectedImage(image)
        setFindStoreForBannerVisible(true)
    }


    const findStoreForBannerForm = () => {
        console.log(props.userinfo.user.stores)
        return (
            <List.Item>
            Select the store:
            <Form onSubmit={handleStoreSelectionForBanner}>
                <Form.Field control='select' value={selectedStore} onChange={({ target }) => setSelectedStore(target.value)}>
                    <option key=""> </option>
                    {props.userinfo.user.stores.map(store => <option key={store._id}>{store.name}</option>)}
                </Form.Field>
                <Button type="submit">Select</Button> 
            </Form>
            <Button onClick={() => setFindStoreForBannerVisible(false)}>Cancel</Button>
        </List.Item>
        )
    }


    const handleStoreSelectionForBanner = async (event) => {
        event.preventDefault()
        console.log(selectedStore)
        const selected = props.userinfo.user.stores.filter(store => store.name === selectedStore)
        console.log(selected)
        const storeToSave = { ...selected[0], image: selectedImage }
        try {
            storeService.setToken(props.userinfo.token)
            await storeService.update(storeToSave)
            props.newMessage(`Image attached to store successfully`, 'green')
        } catch (error) {
            console.log(error.message)
            props.newMessage(`Something went wrong: ${error.message}`, 'red')
        }
        setSelectedImage(undefined)
        setSelectedStore(undefined)
        setFindStoreForBannerVisible(false)
    }

    return (
        <Segment padded='very' color='olive'>
        <Grid columns={3}>
            {images.map(image =>
                <List key={image._id}>
                    <List.Item>
                        <Image src={image.thumbnailLarge} alt="" />
                    </List.Item>
                    <List.Item>
                        {image.name}
                    </List.Item>
                    <List.Item>
                        {image.description}
                    </List.Item>
                    <List.Item>
                        <Breadcrumb>
                            <Breadcrumb.Section link onClick={(event) => handleDelete(event, image)}>Delete</Breadcrumb.Section>
                            <Breadcrumb.Divider/>
                            <Breadcrumb.Section link onClick={(event) => attachToProduct(event, image)}>Attach to product</Breadcrumb.Section>
                            <Breadcrumb.Divider/>
                            <Breadcrumb.Section link onClick={(event) => attachToStore(event, image)}>Use as a Banner</Breadcrumb.Section>
                            <Breadcrumb.Divider/>
                        </Breadcrumb>
                    </List.Item>
                    {findStoreVisible === true && !(selectedImage === null) && selectedImage._id === image._id && findStoreForm()}
                    {findProductVisible === true && !(selectedImage === null) && selectedImage._id === image._id && findProductForm()}
                    {findStoreForBannerVisible === true && !(selectedImage === null) && selectedImage._id === image._id && findStoreForBannerForm()}
                </List>
            )}           
        </Grid>
        </Segment>
    )
}

const mapStateToProps = (state) => {
    return {
        userinfo: state.userinfo,
        messages: state.messages,
        thisStore: state.thisStore
    }
}

const mapDispatchToProps = {
    newMessage,
    getAllProductsOfAStoreWithQuery,
    setStoreWithoutQuery
}

export default connect(mapStateToProps, mapDispatchToProps)(Gallery)