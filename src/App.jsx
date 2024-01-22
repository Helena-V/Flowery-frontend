import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link, Route, withRouter } from 'react-router-dom'
import Login from './components/Login'
import NewUser from './components/NewUser'
import ControlPanel from './components/ControlPanel'
import Gallery from './components/Gallery'
import MyStores from './components/MyStores'
import StoreDisplay from './components/StoreDisplay'
import StorePage from './components/storedisplay/StorePage'
import Product from './components/storedisplay/Product'
import ShoppingCart from './components/ShoppingCart'
import Checkout from './components/Checkout'
import SearchPage from './components/SearchPage'
import PaymentSuccess from './components/PaymentSuccess'
import { newMessage } from './reducers/messageReducer'
import { setUser, logoutUser } from './reducers/userReducer'
import { resetStateOfStore } from './reducers/individualStoreReducer'
import { setSearchValues, setLoadingReady } from './reducers/searchReducer'
import { Container, Menu, Header, Button, Icon, Modal, Transition, Form, Segment, Statistic } from 'semantic-ui-react'
import styled from 'styled-components'

const Message = styled.div`
  position: absolute;
  left: 1em;
  top: 1em;
  width: 15%;
  padding: 3em;
  text-align: center;
  background-color: #e7e8e9;
`
const PinkLink = styled.a`
  display: inline-block;
  background-color: #F174BA;
  color: #000000;
`

const App = (props) => {
  const [visible, setVisible] = useState(true)
  const [wordToSearch, setWordToSearch] = useState('')
  const [option, setOption] = useState('')
  const options = [
    { key: 'products', text: 'Products', value: 'products' },
    { key: 'stores', text: 'Stores', value: 'stores' },
    { key: 'all', text: 'All', value: 'all' },
  ]

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('userLoggedIn')
    if (loggedUser) {
      const userinfo = JSON.parse(loggedUser)
      props.setUser(userinfo)
    }
  }, [])


  const handleLogout = (event) => {
    props.resetStateOfStore()
    props.logoutUser()
    props.history.push('/')
  }


  const storeByName = (name) => props.allStores.find(store => store.name === name)


  const productById = (id) => {
    if (props.thisStore === null) {
      return null
    } else {
      return props.thisStore.products.find(product => product._id === id)
    }
  }


  const toHomeAndReset = (event) => {
    event.preventDefault()
    props.resetStateOfStore()
    props.history.push("/")
  }


  const toControlPanelAndReset = (event) => {
    event.preventDefault()
    props.resetStateOfStore()
    props.history.push("/controlpanel")
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    props.setSearchValues(wordToSearch, option)
    props.setLoadingReady()
    setWordToSearch('')
    setOption('')
    props.history.push('/search')
  }


  if (!props.userinfo.user) {
    return (

      <Container>
        <Menu color='olive' inverted stackable>
          <Menu.Item>
            <Header as='h1'>Flowery</Header>
          </Menu.Item>
          <Menu.Item>
            <Link onClick={(event) => toHomeAndReset(event)} to="/">Home</Link>
          </Menu.Item>
          <Menu.Item>
            <Transition animation='pulse' duration='1000' visible={visible}>
              <Link to="/shoppingcart">
                <Icon name='shopping cart' size='large' />
              </Link>
            </Transition>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Login></Login>
            </Menu.Item>
            <Menu.Item>
              <Modal trigger={<Button inverted color='olive'>Create new user</Button>}>
                <NewUser></NewUser>
              </Modal>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Segment basic>
            <Form size='mini' onSubmit={handleSearchSubmit}>
              <Form.Group inline>
                <Form.Field>
                  <input type='text' onChange={({ target }) => setWordToSearch(target.value)} value={wordToSearch} placeholder='Search...' />
                </Form.Field>
                <Form.Field control='select' onChange={({ target }) => setOption(target.value)} value={option}>
                  <option> </option>
                  {options.map(option => <option key={option.key} value={option.value}>{option.text}</option>)}
                </Form.Field>
                <Button type='submit'>Search</Button>
              </Form.Group>
            </Form>          
        </Segment>
      <Segment basic>
        { props.messages.visibility ? <div className={props.messages.style}>{props.messages.text}</div>  : '' }
      </Segment>
        <Route exact path="/" render={() => <StoreDisplay></StoreDisplay>} />
        <Route exact path="/stores/:storeName" render={({ match }) =>
          <StorePage store={storeByName(match.params.storeName)} visible={visible} setVisible={setVisible}></StorePage>} />
        <Route exact path="/stores/:storeName/products/:id" render={() =>
          <Product visible={visible} setVisible={setVisible}></Product>} />
        <Route exact path="/shoppingcart" render={() => <ShoppingCart></ShoppingCart>} />
        <Route exact path="/checkout" render={() => <Checkout></Checkout>} />
        <Route exact path="/search" render={() => <SearchPage></SearchPage>} />
        <Route exact path="/paymentSuccessfull" render={() => <PaymentSuccess></PaymentSuccess>} />
        <Message>
          <Container>
            Welcome to Flowery! This is a programming project made on course <PinkLink href="https://fullstackopen.com/en/" target="_blank" rel="noopener noreferrer"> Fullstack Open </PinkLink> in Helsinki University. Please view the code for <PinkLink href="https://github.com/Helena-V/Flowery-frontend" target="_blank" rel="noopener noreferrer"> front end </PinkLink> or for <PinkLink href="https://github.com/Helena-V/Flowery-backend" target="_blank" rel="noopener noreferrer"> back end </PinkLink> on Github. More info about the app is available on <PinkLink href="https://github.com/Helena-V/Flowery/blob/main/README.md" target="_blank" rel="noopener noreferrer"> README.MD  </PinkLink>
          </Container>
          <Container><br />
            Technologies, packages & tools used:
            <Statistic horizontal>
              <Statistic.Label>React, React Redux, MongoDB, Node, Semantic UI, React Router, Styled Components, Stripe, Vite, Axios, Express, bcrypt.js, jsonwebtoken, Nodemon, Mongoose, Multer, Sharp, dotenv, cors, Jest, supertest, Postman, HTML, CSS, Javascript, Git, Github, Visual Studio Code, Linux Ubuntu.</Statistic.Label>
            </Statistic>
          </Container>
        </Message>
      </Container>

    )
  }


  return (

    <Container>
      <Menu color='olive' inverted stackable>
        <Menu.Item>
          <Header as='h1'>Flowery</Header>
        </Menu.Item>
        <Menu.Item>
          <Link onClick={(event) => toHomeAndReset(event)} to="/">Home</Link>
        </Menu.Item>
        <Menu.Item>
          <Link onClick={(event) => toControlPanelAndReset(event)} to="/controlpanel">Controlpanel</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/mystores">My Stores</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/gallery">Gallery</Link>
        </Menu.Item>
        <Menu.Item>
          <Transition animation='pulse' duration='1000' visible={visible}>
            <Link to="/shoppingcart">
              <Icon name='shopping cart' size='large' />
            </Link>
          </Transition>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Button inverted color='olive' onClick={handleLogout}>Log out</Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <Form size='mini' onSubmit={handleSearchSubmit}>
        <Form.Group inline>
          <Form.Field>
            <input type='text' onChange={({ target }) => setWordToSearch(target.value)} value={wordToSearch} placeholder='Search...' />
          </Form.Field>
          <Form.Field control='select' onChange={({ target }) => setOption(target.value)} value={option}>
            <option> </option>
            {options.map(option => <option key={option.key} value={option.value}>{option.text}</option>)}
          </Form.Field>
          <Button type='submit'>Search</Button>
        </Form.Group>
      </Form>
      <Segment basic>
        { props.messages.visibility ? <div className={props.messages.style}>{props.messages.text}</div>  : '' }
      </Segment>
      <Route exact path="/" render={() => <StoreDisplay></StoreDisplay>} />
      <Route exact path="/stores/:storeName" render={({ match }) =>
        <StorePage store={storeByName(match.params.storeName)} visible={visible} setVisible={setVisible}></StorePage>} />
      <Route exact path="/controlpanel" render={() => <ControlPanel></ControlPanel>} />
      <Route exact path="/mystores" render={() => <MyStores></MyStores>} />
      <Route exaxt path="/gallery" render={() => <Gallery></Gallery>} />
      <Route exact path="/stores/:storeName/products/:id" render={({ match }) =>
        <Product product={productById(match.params.id)} visible={visible} setVisible={setVisible}></Product>} />
      <Route exact path="/shoppingcart" render={() => <ShoppingCart></ShoppingCart>} />
      <Route exact path="/checkout" render={() => <Checkout></Checkout>} />
      <Route exaxt path="/search" render={() => <SearchPage></SearchPage>} />
      <Route exact path="/paymentSuccessfull" render={() => <PaymentSuccess></PaymentSuccess>} />
      <Message>
      <Container>
          Welcome to Flowery! This is a programming project made on course <PinkLink href="https://fullstackopen.com/en/" target="_blank" rel="noopener noreferrer"> Fullstack Open </PinkLink> in Helsinki University. Please view the code for <PinkLink href="https://github.com/Helena-V/Flowery-frontend" target="_blank" rel="noopener noreferrer"> front end </PinkLink> or for <PinkLink href="https://github.com/Helena-V/Flowery-backend" target="_blank" rel="noopener noreferrer"> back end </PinkLink> on Github. More info about the app is available on <PinkLink href="https://github.com/Helena-V/Flowery/blob/main/README.md" target="_blank" rel="noopener noreferrer"> README.MD  </PinkLink>
      </Container>
        <Container><br />
          Technologies, packages & tools used:
          <Statistic horizontal>
            <Statistic.Label>React, React Redux, MongoDB, Node, Semantic UI, React Router, Styled Components, Stripe, Vite, Axios, Express, bcrypt.js, jsonwebtoken, Nodemon, Mongoose, Multer, Sharp, dotenv, cors, Jest, supertest, Postman, HTML, CSS, Javascript, Git, Github, Visual Studio Code, Linux Ubuntu.</Statistic.Label>
          </Statistic>
        </Container>
      </Message>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages,
    userinfo: state.userinfo,
    allStores: state.allStores,
    thisStore: state.thisStore,
    thisProduct: state.thisProduct,
    searchStatus: state.searchStatus
  }
}

const mapDispatchToProps = {
  setUser,
  logoutUser,
  newMessage,
  resetStateOfStore,
  setSearchValues,
  setLoadingReady
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
