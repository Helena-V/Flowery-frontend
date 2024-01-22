import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { newMessage } from '../reducers/messageReducer'
import { setStateOfACart, resetShoppingCart } from '../reducers/shoppingCartReducer'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Segment, Button, Form, Loader, Dimmer, List } from 'semantic-ui-react'
import NumericLabel from 'react-pretty-numbers'
import './CheckoutForm.css'
import axios from 'axios'

const CheckoutForm = (props) => {
  const stripe = useStripe()
  const elements = useElements()
  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ streetAddress, setStreetAddress ] = useState('')
  const [ city, setCity ] = useState('')
  const [ state, setState ] = useState('')
  const [ country, setCountry ] = useState('')
  const [ postalcode, setPostalcode ] = useState('')
  const [ paymentIntent, setPaymentIntent ] = useState('')
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    const storedContents = window.localStorage.getItem('shoppingCart')
    if (storedContents) {
      const contents = JSON.parse(storedContents)
      console.log(contents)
        if (contents.length > 0) {
          props.setStateOfACart(contents)
          const functionToLoad = async () => {
            try {
              const result = await axios.post('/api/payments/create-payment-intent', contents)
              console.log(result)
              setPaymentIntent(result.data)
            } catch (error) {
              console.log(error.message)
              props.newMessage('Something went wrong: ', error.message)
            }
          }
          functionToLoad()
        }
    }
  }, [])

  const options = {
    'justification': 'L',
    'currency': true,
    'currencyIndicator': 'EUR',
    'precision': 2
  }

    const handleSubmit = async (event) => {
      event.preventDefault()
      setLoading(true)
      if (!stripe || !elements || paymentIntent === '') {
        console.log('return')
        setLoading(false)
        return
      }
      const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: name,
          },
        }
      })
      console.log('result', result)
      if (result.error) {
        props.newMessage('Action cancelled: ', result.error.message)
        setLoading(false)
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          const customer = { name, email, streetAddress, city, state, country, postalcode }
          const items = props.shoppingCart
          try {
            await axios.post('/api/payments/collect-order-details', { customer, items })
            props.newMessage('Payment successfull')
            setLoading(false)
            props.history.push('/paymentSuccessfull')
          } catch (error) {
            console.log(error.message)
            props.newMessage('Something went wrong: ', error.message)
            setLoading(false)
          }
        }
      }
    }


    const total = () => {
      if (!props.shoppingCart === null || props.shoppingCart.length > 0) {
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
      return null
    }

    const CARD_ELEMENT_OPTIONS = {
        style: {
          base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#aab7c4",
            },
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
          },
        },
      }

    const processing = () => {
      if (loading) {
        return (
          <Dimmer active inverted>
            <Loader>Processing payment, please wait.</Loader>            
          </Dimmer>
        )
      } else {
        return null
      }
    }

    return (
      <Segment basic>
        <Segment basic size='huge'>Total: <NumericLabel params={options}>{total()}</NumericLabel></Segment>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
          <label>Name: </label>
          <input onChange={({ target }) => setName(target.value)} />            
          </Form.Field>
          <Form.Field>
          <label>Email:</label>
          <input onChange={({ target }) => setEmail(target.value)} />            
          </Form.Field>
          <Form.Field>
          <label>Street Address:</label>
          <input onChange={({ target }) => setStreetAddress(target.value)}/>            
          </Form.Field>
          <Form.Field>
          <label>City:</label>
          <input onChange={({ target }) => setCity(target.value)}/>            
          </Form.Field>
          <Form.Field>
          <label>Postal Code:</label>
          <input onChange={({ target }) => setPostalcode(target.value)}/>            
          </Form.Field>
          <Form.Field>
          <label>State:</label>
          <input onChange={({ target }) => setState(target.value)}/>            
          </Form.Field>
          <Form.Field>
          <label>Country:</label>
          <input onChange={({ target }) => setCountry(target.value)}/>            
          </Form.Field>
          <label>
            Card details
                <CardElement options={CARD_ELEMENT_OPTIONS} />
          </label>
          <Button type='submit' disabled={!stripe}>Confirm order</Button>
          {processing()}
        </Form>
        <Segment padded inverted color='red'>Warning! This app is running on test mode only. Do no enter any sensitive information.
          For testing purposes use any customer information and Stripe test card numbers:
          <List>
            <List.Item></List.Item>
            <List.Item>
              4242 4242 4242 4242
            </List.Item>
            <List.Item>
              12/25
            </List.Item>
            <List.Item>
              123
            </List.Item>
            <List.Item>
              94103
            </List.Item>
          </List>
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
    newMessage,
    setStateOfACart,
    resetShoppingCart
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CheckoutForm))