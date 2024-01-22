import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import StoreIcon from './storedisplay/StoreIcon'
import { getAllStores } from '../reducers/storesReducer'
import { setStoreWithoutQuery } from '../reducers/individualStoreReducer'
import { Link, withRouter } from 'react-router-dom'
import { Grid, Dimmer, Loader } from 'semantic-ui-react'


const StoreDisplay = (props) => {
    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const functionToLoad = async () => {
            try {
                await props.getAllStores()
                setIsLoading(false)
            } catch (error) {
                console.log(error)
                setIsLoading(false)
            }
        }
        functionToLoad()
    }, [])

    if (isLoading) {
        return (
            <Dimmer active inverted>
                <Loader>Loading...</Loader>
            </Dimmer>
        )
    }
    if (props.allStores === null) { return null }

    const chooseStore = (event, store) => {
        event.preventDefault()
        props.setStoreWithoutQuery(store)
        props.history.push(`/stores/${store.name}`)
    }

    return (
        <Grid columns={3} padded='vertically'>
                {props.allStores.map(store =>
                    <Link onClick={(event) => chooseStore(event, store)} key={store._id} to={`/stores/${store.name}`}>
                        <StoreIcon key={store._id} store={store}></StoreIcon>
                    </Link>
                )}
        </Grid>
    )
}

const mapStateToProps = (state) => {
    return {
        allStores: state.allStores,
        thisStore: state.thisStore
    }
}

const mapDispatchToProps = {
    getAllStores,
    setStoreWithoutQuery
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StoreDisplay))