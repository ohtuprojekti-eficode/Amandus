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
                            <Link to={"/edit"+e}>{e}</Link>
                            <Route exact path={"/edit"+e} render={() => <EditView content={e}/>} />
                         </li>
                    ))}
                </ul>
            </div>
        </Router>
    )
}

export default ListView
