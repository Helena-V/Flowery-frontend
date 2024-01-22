import { useState, useEffect} from 'react'
import { connect } from 'react-redux'
import userService from '../services/users'
import { newMessage } from '../reducers/messageReducer'
import { deleteProductFromStore } from '../reducers/individualStoreReducer'
import { Segment, Dimmer, Loader, Table, Button } from 'semantic-ui-react'

const MyStores = (props) => {
    const [ stores, setStores ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        const functionToLoad = async () => {
            try {
                const data = await userService.getStoresCreatedByUserWithProducts(props.userinfo.user._id)
                console.log(data)
                setStores(data.storesWithProducts)
                setIsLoading(false)
            } catch (error) {
                console.log(error)
                setIsLoading(false)
            }
        }
        functionToLoad()
        console.log(stores)
    }, [])

    console.log(stores)

    if (isLoading) {
        return (
            <Dimmer active inverted>
                <Loader>Loading...</Loader>
            </Dimmer>
        )
    }

    if (stores === null || stores.length === 0) {
        return (
            <Segment>
                No stores created yet.
            </Segment>
        )
    }

    const handleClick = (product) => {
        const functionToReturn = async () => {
            console.log('click')
            console.log(product)
            const store = stores.filter(store => store._id === product.store)
            console.log(store)
            const filtered = store[0].products.filter(p => !(p._id === product._id))
            console.log(filtered)
            const newStore = { ...store[0], products: filtered }
            console.log(newStore)
            const removeOldStore = stores.filter(s => !(s._id === store[0]._id))
            console.log(removeOldStore)
            const updatedStores = removeOldStore.concat(newStore)
            console.log(updatedStores)
            try {
                await props.deleteProductFromStore(store, product, props.userinfo.token)
                setStores(updatedStores)
            } catch (error) {
                console.log(error)
            }
        }
        return functionToReturn
    }

    return (
        <Segment>
            {stores.map((store) => {
                return (
                <Table key={store._id} celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='5'>{store.name}</Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell>Product Name</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell>On sale</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                        <Table.Body>
                            {store.products.map(product => 
                                    <Table.Row key={product._id}>
                                        <Table.Cell>{product.name}</Table.Cell>
                                        <Table.Cell>{product.price}</Table.Cell>
                                        <Table.Cell>{product.onSale ? 'true' : 'false' }</Table.Cell>
                                        <Table.Cell>{product.amountOfItems}</Table.Cell>
                                        <Table.Cell><Button onClick={handleClick(product)}>Remove product</Button></Table.Cell>
                                    </Table.Row>
                            )}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan='5'>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>)
            })}
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
    deleteProductFromStore
}

export default connect(mapStateToProps, mapDispatchToProps)(MyStores)