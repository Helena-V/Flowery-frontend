import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { newMessage } from '../reducers/messageReducer'
import { removeProductFromCart, setStateOfACart } from '../reducers/shoppingCartReducer'
import { Segment, Button, Image, Header, List, Icon } from 'semantic-ui-react'
import NumericLabel from 'react-pretty-numbers'


const ShoppingCart = (props) => {

    useEffect(() => {
        const storedContents = window.localStorage.getItem('shoppingCart')
        if (!storedContents === undefined || !storedContents === null) {
            const contents = JSON.parse(storedContents)
            if (contents.length > 0) {
                props.setStateOfACart(contents)
            }
        }
    }, [])

    if (props.shoppingCart.length < 1) {
        return (
            <Segment basic>Shopping cart is empty.</Segment>
        )
    }

    const options = {
        'justification':'L',
        'currency':true,
        'currencyIndicator':'EUR',
        'precision':2
      }

    const image = (product) => {
        if (product.image === null || product.image === undefined) {
            return <Image src='/image-placeholder.png' size='small' alt='placeholder' />
        } 
        return (
            <Image src={product.image.thumbnailSmall} size='small' alt={product.image.name} />
        )
    }

    const sum = () => {
        const prices = props.shoppingCart.map(product => {
            if (product.onSale) {
                const total = product.price - (product.amountOfDiscount * product.price)
                if (product.itemsInCart) {
                    return product.itemsInCart * total
                } else {
                    return total
                }
            } else {
                if (product.itemsInCart) {
                    return product.price * product.itemsInCart
                } else {
                    return product.price
                }       
            }
        })
        return prices.reduce((a, b) => a + b, 0)
    }

    const handleRemoval = (product) => {
        props.removeProductFromCart(product._id)
    }

    const onSale = (product) => {
        if (product.onSale) {
            return (
                <List.Item>
                    On sale! {product.amountOfDiscount * 100} % off!
            </List.Item>
            )
        } else {
            return null
        }
    }

    const itemsInCart = (product) => {
        if (product.itemsInCart) {
            return (
                <List.Item>
                    Amount of Items: {product.itemsInCart}
                </List.Item>
            )
        } else {
            return null
        }
    }

    return (
        <Segment basic>
            {props.shoppingCart.map(product => {
                console.log(product)
                return (
                    <Segment key={product._id} basic>
                        <Header as='h3'>{product.name}</Header>
                        {image(product)}
                        <List>
                            <List.Item>
                                Price: <NumericLabel params={options}>{product.price}</NumericLabel>
                            </List.Item>
                            {onSale(product)}
                            {itemsInCart(product)}
                        </List>
                        <Button onClick={() => handleRemoval(product)}>Remove Item</Button>
                    </Segment>
                )
            }
            )}
            <Segment basic size='huge'>Total: <NumericLabel params={options}>{sum()}</NumericLabel></Segment>
            <Link to='/checkout'>
                <Button animated fluid size='massive'>
                    <Button.Content visible>Checkout</Button.Content>
                    <Button.Content hidden>
                        <Icon name='arrow right' />
                    </Button.Content>
                </Button>
            </Link>
        </Segment>
    )
}

const mapStateToProps = (state) => {
    return {
        userinfo: state.userinfo,
        shoppingCart: state.shoppingCart
    }
}

const mapDispatchToProps = {
    newMessage,
    removeProductFromCart,
    setStateOfACart
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart)