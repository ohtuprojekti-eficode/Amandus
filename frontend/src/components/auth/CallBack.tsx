import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { AUTHORIZE_WITH_GH } from '../../graphql/mutations';
import { UserType } from '../../types';

const CallBack = () => {

  const [userdata, setUserData] = useState(null);
  const [responseError, setResponseError] = useState(false);


  const queryString = window.location.search
  const params = new URLSearchParams(queryString);

  const [authenticate, { loading, data, error }] = useMutation<UserType, any>(AUTHORIZE_WITH_GH,
    { variables: { code: params.get('code') }
   });

  useEffect(() => {
    if(!userdata) {
      (async () => {
        const response: any = await authenticate();
        console.log('RES:',response)
        if(response.data) {
          setUserData(response.data.authorizeWithGithub);
        }
      })()
    } 
  }, [userdata]);

  return (
    <div>
      <p>{JSON.stringify(params.get('code'))}</p>
    </div>
  )
}

export default CallBack