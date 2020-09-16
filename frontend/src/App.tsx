import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom'

import { getFiles } from './store/actions/files'

import ListView from './components/ListView'

const App = (props:any) => {

    useEffect(() => {
        if (props.fetching) {
            props.getFiles()
        }
    }, [props])

    const padding = {
        paddingRight: 5
    }

    if (props.fetching) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (props.error) {
        return (
            <div>
                Error while fetching files...
            </div>
        )
    }

    return (
        <Router>
            <div>
                <Link style={padding} to="/">Main menu</Link>
                <Link style={padding} to="/filelist">File listing</Link>
                <Route exact path="/filelist" render={() => <ListView files={props.fileList} />} />
            </div>
        </Router>
    )
}

const mapStateToProps = (state:any) => {
	return {
        fileList: state.files.fileList,
        fetching: state.files.fetching,
        error: state.files.error
	}
}

const ConnectedApp = connect(mapStateToProps, {
	getFiles,
})(App)

export default ConnectedApp