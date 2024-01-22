import { useState } from 'react'
import { connect } from 'react-redux'
import { newMessage } from '../../reducers/messageReducer'
import { setStoreWithoutQuery, createProductAndAddProductToStore, resetStateOfStore } from '../../reducers/individualStoreReducer'
import { updateJustAdded } from '../../reducers/productReducer'
import { Header, Form, Button, Segment } from 'semantic-ui-react'

const NewProduct = (props) => {
    const [ storeInWhichToAdd, setStoreInWhichToAdd ] = useState(undefined)
    const [ name, setName ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ keyWords, setKeyWords ] = useState('')
    const [ price, setPrice ] = useState('')
    const [ discount, setDiscount ] = useState(false)
    const [ amountOfDiscount, setAmountOfDiscount ] = useState('')
    const [ amountOfItems, setAmountOfItems ] = useState('')
    const [ formVisible, setFormVisible ] = useState(false)

    if (props.userinfo.user === null) {
        return null
    }
    if (props.userinfo.user.stores.length < 1) {
        return (
            <Segment padded color='olive'>
                <Header as='h3'>Create new products</Header>
                You have no stores created: Please create a store first.
            </Segment>
        )
    }
    if (props.userinfo.user.stores === undefined) {
        return null
    }

    const handleStoreChange = async (event) => {
        event.preventDefault()
        const chosenStore = props.userinfo.user.stores.find(store => store.name === storeInWhichToAdd)
        props.setStoreWithoutQuery(chosenStore)
        props.newMessage(`Store ${chosenStore.name} chosed`, 'green')
        setFormVisible(true)
    }


    const handleSubmit = async (event) => {
        event.preventDefault()
        const product = {
            name: name,
            description: description,
            keyWords: keyWords,
            price: Number(price),
            onSale: discount,
            amountOfDiscount: Number(amountOfDiscount),
            store: props.thisStore._id,
            amountOfItems: Number(amountOfItems),
            instructions: null,
            image: null
        }
        try {
            await props.createProductAndAddProductToStore(props.thisStore, product, props.userinfo.token)
            props.newMessage(`${product.name} added to store ${props.thisStore.name}`, 'green')
            props.updateJustAdded(product)
        } catch (error) {
            console.log(error)
            props.newMessage(`Something went wrong: ${error.message}`, 'red')
        }
        setName('')
        setKeyWords('')
        setDescription('')
        setPrice(0)
        setDiscount(false)
        setAmountOfDiscount(0)
        setAmountOfItems(0)
        setFormVisible(false)
        setStoreInWhichToAdd(undefined)
        props.resetStateOfStore()
    }


    const productForm = () => {
        return (
                <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <label>Name:</label>
                    <input placeholder="Name" value={name} onChange={({ target }) => setName(target.value)}/>
                </Form.Field>
                <Form.TextArea label='Description of the product:' value={description} onChange={({ target }) => setDescription(target.value)}/>
                <Form.Field>
                    <label>Key words to use in search:</label>
                    <input placeholder="Key words" value={keyWords} onChange={({ target }) => setKeyWords(target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Price:</label>
                    <input placeholder="Price in euros, eg. 5.90" value={price} onChange={({ target }) => setPrice(target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>On sale: (true / false)</label>
                    <input value={discount} onChange={({ target }) => setDiscount(target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>If on sale, amount of discount in decimals:</label>
                    <input placeholder="Eg. 20% as 0.20" value={amountOfDiscount} onChange={({ target }) => setAmountOfDiscount(target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Amount of Items:</label>
                    <input placeholder="Amount of items in stock" value={amountOfItems} onChange={({ target }) => setAmountOfItems(target.value)}/>
                </Form.Field>
                <Button type="submit">Add product</Button>
            </Form>
        )
    }


    return (
        <Segment padded color='olive'>
            <Header as='h3'>Create new products</Header>
            First select the store:
            <Form onSubmit={handleStoreChange}>
                <Form.Field control='select' value={storeInWhichToAdd} onChange={({ target }) => setStoreInWhichToAdd(target.value)}>
                    <option key=""> </option>
                    {props.userinfo.user.stores.map(store => 
                    <option key={store._id}>{store.name}</option>)}
                </Form.Field>      
                <Button type="submit">Select</Button>         
            </Form>
            {formVisible === true && productForm()}
        </Segment>
    )
}


const mapStateToProps = (state) => {
    return {
        allStores: state.stores,
        messages: state.messages,
        userinfo: state.userinfo,
        thisStore: state.thisStore    
    }
}

const mapDispatchToProps = {
    newMessage,
    setStoreWithoutQuery,
    createProductAndAddProductToStore,
    updateJustAdded,
    resetStateOfStore
}

export default connect(mapStateToProps, mapDispatchToProps)(NewProduct)