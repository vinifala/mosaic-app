This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

### Running
To run this project, clone the repo
```bash
git clone https://github.com/vinifala/mosaic-app.git && cd mosaic-app
``` 

### Credentials
This mosaic uses the [IMGUR API](https://apidocs.imgur.com/#authorization-and-oauth) to query and host images. You will need an IMGUR *client ID* to be able to access the API. 
Once you have your ID, edit the file `./example.env` and replace `Your IMGUR client ID` with your client ID from IMGUR on line
```
IMGUR_CLIENT_ID=Your IMGUR client ID 
```

Then rename `example.env` to `.env` to prevent git from committing your credential.

### Install dependencies
```bash
npm install
``` 
### Start the server
```bash
npm run start
``` 
### We're live! (well, kind of)
Access [http://localhost:3001](http://localhost:3001)

#### Don't forget about tests
```bash
npm run test
```
