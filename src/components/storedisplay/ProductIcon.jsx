import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { newMessage } from '../../reducers/messageReducer'
import { addProductToCart } from '../../reducers/shoppingCartReducer'
import { Image, List, Header, Button, Segment } from 'semantic-ui-react'
import NumericLabel from 'react-pretty-numbers'

const ProductIcon = (props) => {

    const options = {
        'justification': 'L',
        'currency': true,
        'currencyIndicator': 'EUR',
        'precision': 2
      }

    const handleAddToCart = () => {
        console.log(props.product)
        props.addProductToCart(props.product)
        props.newMessage(`${props.product.name} added to cart`, 'green')
        props.setVisible(!(props.visible))
        if (props.thisStore === null) {
            props.history.push('/')
        } else {
            props.history.push(`/stores/${props.thisStore.name}`)        
        }
    }

    const image = () => {
        if (props.product.image === null || props.product.image === undefined) {
            return <Image src='/image-placeholder.png' size='small' alt='placeholder'/>
        } 
        return (
            <Image src={props.product.image.thumbnailLarge} size='small' alt={props.product.image.name} />
        )
    }

    return (
        <Segment basic>
            <Header as='h3'>{props.product.name}</Header>
            {image()}
            <List>
                <List.Item>
                    Price: <NumericLabel params={options}>{props.product.price}</NumericLabel>
                </List.Item>
                <List.Item>
                    <Button onClick={handleAddToCart}>Add to cart</Button>
                </List.Item>
            </List>
        </Segment>
    )
}

const mapStateToProps = (state) => {
    return {
        userinfo: state.userinfo,
        messages: state.messages,
        thisStore: state.thisStore,
        thisProduct: state.thisProduct
    }
}

const mapDispatchToProps = {
    newMessage,
    addProductToCart
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductIcon))