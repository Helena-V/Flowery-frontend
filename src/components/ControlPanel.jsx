import React from 'react'
import { connect } from 'react-redux'
import NewStore from './controlpanel/NewStore'
import NewProduct from './controlpanel/NewProduct'
import ImageUpload from './controlpanel/ImageUpload'
import DeleteArea from './controlpanel/DeleteArea'
import { Grid, Header } from 'semantic-ui-react'


const ControlPanel = (props) => {

    if (props.userinfo.user === null) {
        return null
    }
    
    return (
            <Grid container stackable columns={2}>
                <Grid.Row>
                    <Header as='h1'>{props.userinfo.user.name} logged in</Header>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <NewStore ></NewStore>            
                    </Grid.Column>
                    <Grid.Column>
                        <NewProduct></NewProduct>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <ImageUpload></ImageUpload>
                    </Grid.Column>
                    <Grid.Column>
                        <DeleteArea></DeleteArea>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
    )
}

const mapStateToProps = (state) => {
    return {
        userinfo: state.userinfo
    }
}

export default connect(mapStateToProps)(ControlPanel)