import React from 'react';
import './loaderPage.css';
import { Loader , Dimmer} from 'semantic-ui-react'

const Spinner = () => (

    <Dimmer active>
        <Loader size='huge' content={'Preparing Chat...'} />
    </Dimmer>
    // <div className='loaderPage'>
    //     <h1>Preparing Chat...</h1>
    // </div>
)

export default Spinner;