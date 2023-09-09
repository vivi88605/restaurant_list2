//require packages
const express = require('express')
const app = express()
const port = 3000
//require express-handlebars
const handlebars = require('express-handlebars')
//body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
//method override
const methodOverride = require("method-override")
app.use(methodOverride('_method'))

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

//瀏覽特定餐廳
app.get("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  // console.log(req.params)
  // console.log(`id:${restaurantId}`)
  restaurantData.findById(restaurantId)
    .lean()
    .then(restaurant => res.render("show", { restaurant }))
    .catch(err => console.log(err))
})

//編輯餐廳頁面
app.get('/restaurants/:restaurantId/edit', (req, res) => {
  const { restaurantId } = req.params
  // console.log(req.params)
  // console.log(`id:${restaurantId}`)
  restaurantData.findById(restaurantId)
    .lean()
    .then(restaurant => res.render("edit", { restaurant }))
    .catch(err => console.log(err))
})

//編輯餐廳
app.put('/restaurants/:restaurantId', (req, res) => {
  const { restaurantId } = req.params
  restaurantData.findByIdAndUpdate(restaurantId, req.body)
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch(err => console.log(err))
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