import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    Route,
    Link
} from 'react-router-dom'
import { getFiles } from './store/actions/files'
import ListView from './components/ListView'
import EditView from './components/EditView'
import { RootState } from './store/store'
import { FilesState } from "./store/reducers/files";

const App = () => {

    const dispatch = useDispatch()
    const files = useSelector<RootState, FilesState>(state => state.files)

    useEffect(() => {
        if (files.fetching) {
            dispatch(getFiles())
        }
    }, [dispatch, files.fetching])

    const padding = {
        paddingRight: 5
    }

    if (files.fetching) return <div>Loading...</div>
    if (files.error) return <div>Error fetching files...</div>

    return (
        <div>
            <Link style={padding} to="/">Main menu</Link>
            <Link style={padding} to="/filelist">File listing</Link>
            <Route exact path="/filelist" component={ListView} />
            <Route path="/edit" component={EditView} />
        </div>
    )
}


export default App