import { Image, Segment, Header } from 'semantic-ui-react'
import { styled } from 'styled-components'

const Wrapper = styled.div`
margin: 1em;
`

const StoreIcon = (props) => {

    const image = () => {
        if (props.store.image === null || props.store.image === undefined) {
            return <Image src='/image-placeholder.png' size='small' />
        } else {
            return (
                <Image src={props.store.image.imageData.data} size='small' alt={props.store.name}/>
            )
        }
    }

    return (
        <Wrapper>
            <Segment margin='20px' padded='very' color='olive'>
                <Header>{props.store.name}</Header>
                {image()}
            </Segment>
        </Wrapper>
    )
}

export default StoreIcon