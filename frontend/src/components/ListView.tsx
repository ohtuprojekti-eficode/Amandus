import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom'
import EditView from './EditView'

const ListView = ({ files }: any) => {
    return (
        <Router>
            <div>
                <h1>List of files in the repository</h1>
                <ul>
                    {files.map((e: string) => (
                        <li key={e}>
                            <Link to="/edit">{e}</Link>
                            <Route exact path="/edit" render={() => <EditView />} />
                         </li>
                    ))}
                </ul>
            </div>
        </Router>
    )
}

export default ListView
