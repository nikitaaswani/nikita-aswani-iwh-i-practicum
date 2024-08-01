const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// A new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {
    const petsEndpoint = 'https://api.hubspot.com/crm/v3/objects/pets?properties=pet_name,pet_type,preferred_food';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(petsEndpoint, { headers });
        const pets = resp.data.results;
        res.render('homepage', { pageTitle: 'Custom Object Pets List | Integrating With HubSpot I Practicum', pets });
    } catch (error) {
        console.error(error);
    }
});

// A new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-pets', (req, res) => {
  try {
    res.render('update', { pageTitle: 'Update Custom Object Pets Form | Integrating With HubSpot I Practicum'});
  } catch (error) {
    console.error(error);
  }
});

// A new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-pets', async (req, res) => {
  const petsEndpoint = 'https://api.hubspot.com/crm/v3/objects/pets';
  const update = {
    properties: {
      pet_name: req.body.pet_name,
      pet_type: req.body.pet_type,
      preferred_food: req.body.preferred_food
    }
  }
  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  };

  try {
    await axios.post(petsEndpoint, update, { headers });
      res.redirect('/');
  } catch (err) {
      console.error(err);
  }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
