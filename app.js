//require packages
const express = require('express')
const app = express()
const port = 3000
//require express-handlebars
const handlebars = require('express-handlebars')

//!!setting template engines
app.engine('handlebars', handlebars({ defaultLayout: 'layout' }))
app.set('view engine', 'handlebars')

//import files
const restaurantList = require('./restaurant.json')
app.use(express.static('public'))// app.use(static('public'))

//routes setting
app.get('/', (req, res) => {
  // res.send(`<h1>aloha</h1>`)
  res.render('index', { restaurant: restaurantList.results })
})

app.get('/restaurants/:id', (req, res) => {
  const clicked = restaurantList.results.find(function (item) {
    return item.id.toString() === req.params.id
  })
  res.render('show', { restaurant: clicked })
})

app.listen(port, (req, res) => {
  console.log(`express is running on http://localhost:${port}`)
})