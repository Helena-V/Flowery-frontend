import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { newMessage } from '../../reducers/messageReducer'
import { updateRecentlyViewed } from '../../reducers/productReducer'
import { addProductToCart } from '../../reducers/shoppingCartReducer'
import { Image, Container, Button, Header, Table, List } from 'semantic-ui-react'
import NumericLabel from 'react-pretty-numbers'

const Product = (props) => {

    const options = {
        'justification': 'L',
        'currency': true,
        'currencyIndicator': 'EUR',
        'precision': 2
      }

    if (props.thisProduct.productAtHand === null || props.thisProduct.productAtHand === undefined) {
        return null
    }

    const onSale = () => {
        if (props.thisProduct.productAtHand.onSale === true) {
            const amount = props.thisProduct.productAtHand.amountOfDiscount * 100
            const price = props.thisProduct.productAtHand.price - (props.thisProduct.productAtHand.amountOfDiscount * props.thisProduct.productAtHand.price)
            return (
                <Table.Row>
                    <Table.Cell>On sale!</Table.Cell>
            <Table.Cell>{amount}% off! - new price <NumericLabel params={options}>{price}</NumericLabel></Table.Cell>                
                </Table.Row>
            )
        } else {
            return null
        }
    }

    const handleAddToCart = () => {
        console.log('thisProduct:', props.thisProduct)
        props.addProductToCart(props.thisProduct.productAtHand)
        props.setVisible(!(props.visible))
        props.newMessage(`${props.thisProduct.productAtHand.name} added to cart`, 'green')
    }

    const handleReturn = () => {
        if (props.thisStore === null) {
            props.history.push('/') 
        } else {
            props.history.push(`/stores/${props.thisStore.name}`)       
        }
    }

    const image = () => {
        if (props.thisProduct.productAtHand.image === null || props.thisProduct.productAtHand.image === undefined) {
            return <Image src='/image-placeholder.png' size='small' alt='placeholder'/>
        } else {
            return (
                <Image src={props.thisProduct.productAtHand.image.thumbnailLarge} alt={props.thisProduct.productAtHand.image.name} />
            )
        }
    }


    return (
        <Container>
            <Header as='h2'>{props.thisProduct.productAtHand.name}</Header>
            <Container>{props.thisProduct.productAtHand.description}</Container>
            {image()}
            <Table>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Price:</Table.Cell>
                        <Table.Cell><NumericLabel params={options}>{props.thisProduct.productAtHand.price}</NumericLabel></Table.Cell>
                    </Table.Row>
                    {onSale()}
                    <Table.Row>
                        <Table.Cell>In stock:</Table.Cell>
                        <Table.Cell>{props.thisProduct.productAtHand.amountOfItems}</Table.Cell>
                    </Table.Row>                
                </Table.Body>
            </Table>
            <List>
                <List.Item>
                    <Button onClick={handleAddToCart}>Add to cart</Button>
                </List.Item>
                <List.Item>
                    <Button onClick={handleReturn}>Back to store</Button>
                </List.Item>
                <List.Item>
                    <br />
                </List.Item>
            </List>
        </Container>
    )
}

const mapStateToProps = (state) => {
    return {
        thisProduct: state.thisProduct,
        thisStore: state.thisStore,
        messages: state.messages,
        userinfo: state.userinfo,
    }
}

const mapDispatchToProps = {
    newMessage,
    updateRecentlyViewed,
    addProductToCart
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Product))