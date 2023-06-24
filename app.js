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
  res.render('index')
})

app.get('/restaurants/:id', (req, res) => {
  res.render('show')
})

app.listen(port, (req, res) => {
  console.log(`express is running on http://localhost:${port}`)
})