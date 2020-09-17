import {  
    INIT_GET_FILES,
    GET_FILES_SUCCESS,
    GET_FILES_FAIL
} from '../types/files'

import * as fileService from '../../services/fileService'

import '../reducers/files'

export const getFiles = () => {
    
    return async (dispatch: any) => {

        dispatch({
            type: INIT_GET_FILES
        })

        const response = await fileService.getFiles()
        
        if (response.length > 0) {
            return dispatch({
                type: GET_FILES_SUCCESS,
                payload: response
            })
        }

        return dispatch({
            type: GET_FILES_FAIL,
            payload: response
        })
    }
}
