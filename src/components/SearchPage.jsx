import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { setStoreWithoutQuery } from '../reducers/individualStoreReducer'
import { setProductWithoutQueryAndUpdateViews, setProductWithQuery } from '../reducers/productReducer'
import { newMessage } from '../reducers/messageReducer'
import { searchProducts2, searchStores2, searchAll2, setLoadingReady } from '../reducers/searchReducer'
import ProductIcon from './storedisplay/ProductIcon'
import StoreIcon from './storedisplay/StoreIcon'
import { Container, Header, Grid, Dimmer, Loader } from 'semantic-ui-react'

const SearchPage = (props) => {

    console.log(props.searchStatus)

    useEffect(() => {
        const functionToLoad = async () => {
            if (props.searchStatus.option === 'stores') {
                try {
                    console.log('try search stores')
                    await props.searchStores2(props.searchStatus.word)
                    props.setLoadingReady()
                } catch (error) {
                    console.log(error)
                    props.setLoadingReady()
                }
            }
            if (props.searchStatus.option === 'products') {
                try {
                    console.log('try searchproducts')
                    await props.searchProducts2(props.searchStatus.word)
                    props.setLoadingReady()
                } catch (error) {
                    console.log(error)
                    props.setLoadingReady()
                }
            }
            if (props.searchStatus.option === 'all' || props.searchStatus.option === '') {
                try {
                    await props.searchAll2(props.searchStatus.word)
                    props.setLoadingReady()
                } catch (error) {
                    console.log(error)
                    props.setLoadingReady()
                }
            }
        }
        functionToLoad()
        console.log(props.searchStatus)
    }, [props.searchStatus.word, props.searchStatus.option])

    if (!props.searchStatus.loadingReady) {
        return (
            <Dimmer active inverted>
                <Loader content='Loading...'/>
            </Dimmer>
        )            
    }

    const handleProductLink = async (event, product) => {
        event.preventDefault()
        props.setProductWithoutQueryAndUpdateViews(product)
        props.setStoreWithoutQuery(product.store)
        props.history.push(`/stores/${product.store.name}/products/${product._id}`)
    }

    const handleStoreLink = (event, store) => {
        event.preventDefault()
        props.setStoreWithoutQuery(store)
        props.history.push(`/stores/${store.name}`)
    }

    if (props.searchStatus.option === 'products') {
        return (
            <Container>
                <Header as='h3'>Products found:</Header>
                <p></p>
                <Grid columns={3} stackable>
                    {props.searchStatus.products.map(product => <Link key={product._id} onClick={(event) => handleProductLink(event, product)} to={`/stores/${product.store.name}/products/${product._id}`}>
                        <ProductIcon key={product._id + product.name} product={product}></ProductIcon>
                    </Link>)}
                </Grid>
            </Container>
        )
    }

    if (props.searchStatus.option === 'stores') {
        return (
            <Container>
                <Header as='h3'>Stores found:</Header>
                <p></p>
                <Grid columns={3} stackable>
                    {props.searchStatus.stores.map(store => <Link key={store._id} onClick={(event) => handleStoreLink(event, store)} to={`/stores/${store.name}`}>
                        <StoreIcon key={store._id + store.name} store={store}></StoreIcon>
                    </Link>)}
                </Grid>
            </Container>
        )        
    }

    const productsFoundWhenSearchingAll = () => {
        return (
            <Container>
                <Header as='h3'>Products Found:</Header>
                {props.searchStatus.products.length > 0 ?
                    <Grid columns={3} stackable>
                        {props.searchStatus.products.map(product => <Link key={product._id} onClick={(event) => handleProductLink(event, product)} to={`/stores/${product.store.name}/products/${product._id}`}>
                            <ProductIcon key={product._id + product.name} product={product}></ProductIcon>
                        </Link>)}
                    </Grid>
                    :
                    <Container>
                        <Header as='h3'>No matching results.</Header>
                    </Container>
                }
                <br />
            </Container>
        )
    }

    const storesFoundWhenSearchingAll = () => {
        return (
            <Container>
                <Header as='h3'>Stores found:</Header>
                {props.searchStatus.stores.length > 0 ?
                    <Grid columns={3} stackable>
                        {props.searchStatus.stores.map(store => <Link key={store._id} onClick={(event) => handleStoreLink(event, store)} to={`/stores/${store.name}`}>
                            <StoreIcon key={store._id + store.name} store={store}></StoreIcon>
                        </Link>)}
                    </Grid>
                    :
                    <Container>
                        <Header as='h3'>No matching results.</Header>
                    </Container>
                }
            </Container>
        )
    }

    if (props.searchStatus.option === 'all' ) {
        return (
            <Container>
                {productsFoundWhenSearchingAll()}
                {storesFoundWhenSearchingAll()}
            </Container>
        )
    }

    return (
        <Container>
            <Header as='h3'>No matching results.</Header>
        </Container>
    )
}

const mapStateToProps = (state) => {
    return {
        thisStore: state.thisStore,
        thisProduct: state.thisProduct,
        searchStatus: state.searchStatus
    }
}

const mapDispatchToProps = {
    setStoreWithoutQuery,
    setProductWithoutQueryAndUpdateViews,
    setProductWithQuery,
    newMessage,
    searchProducts2,
    searchStores2,
    searchAll2,
    setLoadingReady
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchPage))