# Token service  

Independent token storage solution for [Amandus](https://github.com/ohtu-project-eficode/Amandus).  

## Installation

Requirements: Yarn  

1. Run `yarn` to install dependencies  
2. Run `yarn dev` to start server in development mode
3. Server should now be running in `localhost:3002`

## Request formats  

All request require Amandus token in authorization header. Post request requires service token in body as json.

```
POST /api/tokens/{user_id}/{service_name}    // Post new access token for user {user_id} 
Authorization: Bearer {amandusToken}

{
  serviceToken: {serviceToken} 
}


GET /api/tokens/{user_id}/{service_name}     // Get access token for service {service_name} of user {user_id} 
Authorization: Bearer {amandusToken}


DELETE /api/tokens/{user_id}/{service_name}  // Delete access token for service {service_name} of user {user_id}
Authorization: Bearer {amandusToken}


DELETE /api/tokens/{user_id}                 // Delete all data related to user {user_id}
Authorization: Bearer {amandusToken}
```




