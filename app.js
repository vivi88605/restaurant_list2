//require packages
const express = require('express')
const app = express()
const port = 3000
//require express-handlebars
const handlebars = require('express-handlebars')
//body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
//setting template engines
app.engine('handlebars', handlebars({ defaultLayout: 'layout' }))
app.set('view engine', 'handlebars')
//import files
const restaurantData = require('./models/restaurantData')
app.use(express.static('public'))
//method override
const methodOverride = require("method-override")
app.use(methodOverride('_method'))

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

//瀏覽全部餐廳
app.get('/', (req, res) => {
  restaurantData.find({})
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => console.log(err))
})

//搜尋特定餐廳
app.get("/search", (req, res) => {
  if (!req.query.keywords) {
    return res.redirect("/")
  }
  const keywords = req.query.keywords
  const processedKeywords = req.query.keywords.trim().toLowerCase()
  restaurantData.find({})
    .lean()
    .then(item => {
      const filteredRestaurants = item.filter(
        data =>
          data.name.toLowerCase().includes(processedKeywords)
          || data.name_en.toLowerCase().includes(processedKeywords)
          || data.category.toLowerCase().includes(processedKeywords)
      )
      res.render("index", { restaurants: filteredRestaurants, keywords })
    })
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

//刪除餐廳
app.delete('/restaurants/:restaurantId', (req, res) => {
  const { restaurantId } = req.params
  restaurantData.findByIdAndDelete(restaurantId, req.body)
    .then(() => res.redirect(`/`))
    .catch(err => console.log(err))
})

app.listen(port, (req, res) => {
  console.log(`express is running on http://localhost:${port}`)
})