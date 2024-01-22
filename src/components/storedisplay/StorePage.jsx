import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { newMessage } from '../../reducers/messageReducer'
import { resetStateOfStore, getAllProductsOfAStoreWithQuery } from '../../reducers/individualStoreReducer'
import { setProductWithoutQueryAndUpdateViews } from '../../reducers/productReducer'
import ProductIcon from './ProductIcon'
import { Container, Header, List, Grid, Segment, Image, Advertisement, Loader, Dimmer } from 'semantic-ui-react'

const StorePage = (props) => {
    const [ isReady, setIsReady ] = useState(false)

    useEffect(() => {
        const functionToLoad = async () => {
            try {
                await props.getAllProductsOfAStoreWithQuery(props.thisStore._id)
                setIsReady(true)
            } catch (error) {
                console.log(error.message)
                setIsReady(true)
            }        
        }
        functionToLoad()
    }, [])

    if(!isReady) {
        return (
            <Dimmer active inverted>
                <Loader>Loading...</Loader>
            </Dimmer>
        )
    }

    if (props.thisStore === null) {
        return null
    }

    const image = () => {
        if (props.thisStore.image === null || props.thisStore.image === undefined) {
            return null
        } else {
            return (
                <Advertisement unit='leaderboard'>
                    <Image src={props.thisStore.image.imageData.data} alt={props.thisStore.name}/>
                </Advertisement>
            )
        }
    }

    if (props.thisStore.products.length < 1 || props.thisStore.products === null) {
        return (
            <Container>
                {image()}
                <Link to={`/stores/${props.thisStore.name}`}>
                    <Header as='h2'>This is page for {props.thisStore.name}</Header>            
                </Link>
                <List>
                    <List.Item>
                        <List.Icon name='marker' />
                        <List.Content>{props.thisStore.location}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name='mail' />
                        <List.Content>
                        <a href={`mailto:${props.thisStore.email}`}>{props.thisStore.email}</a>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name='linkify' />
                        <List.Content>
                            <a href={props.thisStore.webpage}>{props.thisStore.webpage}</a>
                        </List.Content>
                    </List.Item>
                </List>
                <Segment basic>
                    {props.thisStore.description}            
                </Segment>
                No products added
            </Container>
        )
    }


    const handleClick = (event, product) => {
        event.preventDefault()
        props.setProductWithoutQueryAndUpdateViews(product)
        props.history.push(`/stores/${props.store.name}/products/${product._id}`)
    }


    return (
        <Container>
            {image()}
            <Link to={`/stores/${props.thisStore.name}`}>
                <Header as='h2'>This is page for {props.thisStore.name}</Header>
            </Link>
            <List>
                <List.Item>
                    <List.Icon name='marker' />
                    <List.Content>{props.thisStore.location}</List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='mail' />
                    <List.Content>
                        <a href={`mailto:${props.thisStore.email}`}>{props.thisStore.email}</a>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='linkify' />
                    <List.Content>
                        <a href={props.thisStore.webpage}>{props.thisStore.webpage}</a>
                    </List.Content>
                </List.Item>
            </List>
            <Segment basic>
                {props.thisStore.description}
            </Segment>
            <Container>
                <Grid columns={3} stackable>
                    {console.log(props.thisStore.products)}
                    {props.thisStore.products.map(product => <Link key={product._id} onClick={(event) => handleClick(event, product)} to={`/stores/${props.thisStore.name}/products/${product._id}`}>
                        <ProductIcon product={product} visible={props.visible} setVisible={props.setVisible}></ProductIcon>
                    </Link>)}
                </Grid>
            </Container>
        </Container>
        )      
}


const mapStateToProps = (state) => {
    return {
        thisStore: state.thisStore,
        messages: state.messages,
        userinfo: state.userinfo
    }
}

const mapDispatchToProps = {
    newMessage,
    resetStateOfStore,
    setProductWithoutQueryAndUpdateViews,
    getAllProductsOfAStoreWithQuery
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StorePage))