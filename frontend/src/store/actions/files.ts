import {
    INIT_GET_FILES,
    GET_FILES_SUCCESS,
    GET_FILES_FAIL,
    FileActionTypes
} from '../../types'
import * as fileService from '../../services/fileService'
import '../reducers/files'

import { Dispatch } from "redux"

export const getFiles = () => {

    return async (dispatch: Dispatch<FileActionTypes>) => {

        dispatch({
            type: INIT_GET_FILES
        })

        const files = await fileService.getFiles()

        if (files.length > 0) {
            return dispatch({
                type: GET_FILES_SUCCESS,
                payload: files
            })
        }

        return dispatch({
            type: GET_FILES_FAIL
        })
    }
}
