import { useEffect } from 'react'
import { connect } from 'react-redux'
import { resetShoppingCart } from '../reducers/shoppingCartReducer'
import { Segment, Header } from 'semantic-ui-react'

const PaymentSuccess = (props) => {

    useEffect(() => {
        props.resetShoppingCart()
    }, [])
    
    return (
        <Segment>
            <Header as='h3'>Payment Successfull!</Header>
            <Segment basic>
                Thank you for your purchase. 
            </Segment>
        </Segment>
    )
}

const mapStateToProps = (state) => {
    return {
        shoppingCart: state.shoppingCart
    }
}

const mapDispatchToProps = {
    resetShoppingCart
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSuccess)