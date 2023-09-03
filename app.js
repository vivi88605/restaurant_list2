//require packages
const express = require('express')
const app = express()
const port = 3000
//require express-handlebars
const handlebars = require('express-handlebars')
//body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

const restaurantData = require('./models/restaurantData')

//mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant-list', {
  useNewUrlParser: true, useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

//!!setting template engines
app.engine('handlebars', handlebars({ defaultLayout: 'layout' }))
app.set('view engine', 'handlebars')

//import files
app.use(express.static('public'))// app.use(static('public'))

//routes setting
app.get('/', (req, res) => {
  restaurantData.find({})
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => console.log(err))
})

//新增餐廳頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

//新增餐廳
app.post('/restaurants', (req, res) => {
  restaurantData.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

app.get('/restaurants/:id', (req, res) => {
  const clicked = restaurantList.results.find(function (item) {
    return item.id.toString() === req.params.id
  })
  res.render('show', { restaurant: clicked })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const filteredRestaurant = restaurantList.results.filter(function (items) {
    //items.includes(keyword) doesn't work, should be items.name.includes(keyword) etc.
    return items.name.toLowerCase().includes(keyword.toLowerCase()) + items.category.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurant: filteredRestaurant, keyword: keyword })
})

app.listen(port, (req, res) => {
  console.log(`express is running on http://localhost:${port}`)
})