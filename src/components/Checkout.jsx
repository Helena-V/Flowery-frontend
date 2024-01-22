import { connect } from 'react-redux'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'
import { Segment } from 'semantic-ui-react'

const stripePromise = loadStripe("pk_test_lt4syiP7gq64hNrzYz1MgMnE00mmyAx3oP")

const Checkout = (props) => {

    return (
        <Segment basic>
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
        </Segment>
    )
}

const mapStateToProps = (state) => {
    return {
        shoppingCart: state.shoppingCart
    }
}

export default connect(mapStateToProps)(Checkout)