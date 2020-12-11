# General documentation

## Setting up a Github application

The application has a feature to fetch user details and an authorization token from Github. This requires settings up a Github application and configuring it correctly. The procedure is as follows:

1. Navigate to your personal or organization settings and find the `developer settings` to register a new application.

![First step](./imgs/create_app.PNG)

2. Fill in the details. The `callback url` is the most important part here and we set it to `http://135.181.89.96:4000/auth/github/callback` because our application is running at `http://135.181.89.96:4000/`

![Registering the application](./imgs/register_app.PNG)

3. Once you create the application, you are redirected to the configuration page. Here you need to create a client secret and also copy your client id.

![Setting up details](./imgs/setup_details.PNG)

4. Now you're done. You can also access the settings after creation by navigating to `Installed Github apps`

![Configuration after creating](./imgs/configuration_after_creating.PNG)

5. The application has environment values `GH_CLIENT_ID`, `GH_CLIENT_SECRET` & `GH_CB_URL`. These are the client id, client secret and callback url from your newly created app. The [backend documentation](backend.md) has more information regarding the environment values required.

### Running the application locally

##### Without docker-compose

* Follow the instructions in [frontend documentation](frontend.md) and [backend documentation](backend.md) to start the services individually

##### With docker-compose

* In the root of this repository run:
  1. `sudo docker-compose build`
  2. `sudo docker-compose up`
* The application should be viewable in `localhost:3000`
