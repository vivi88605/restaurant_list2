const mongoose = require('mongoose')
const restaurantData = require('../restaurantData')
const restaurantList = require('../../restaurant.json').results
mongoose.connect('mongodb://localhost/restaurant-list', {
  useNewUrlParser: true, useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('running restaurantSeeder script...')
  restaurantData.create(restaurantList)
    .then(() => {
      console.log('restaurantSeeder done!')
      db.close()
    })
    .catch(err => console.log(err))
})