/*
    Si, está todo en un mismo archivo, ¿Que pasa?
    Ahora en serio, era un proyecto tan pequeño que lo
    he comprimido todo aquí. Creo que no era necesario 
    complicarlo más de la cuenta :)
*/

require('express-async-errors')
const helmet = require('helmet')
const marked = require('marked')
const sanitizeHtml = require('sanitize-html')
const express = require('express')
const mongo = require('mongodb')

const app = express()
const PORT = process.env.PORT || 3000

const MONGO_URI = process.env.MONGO_URI
const client = new mongo.MongoClient(MONGO_URI)
const db = client.db(process.env.MONGO_DB)

app.use(helmet())
app.set('views', __dirname+'/views')
app.set('view engine', 'pug')

app.use('/static', express.static(__dirname+'/static'))

app.all('/', async (req,res) => {
    const posts = await db.collection('posts').find().toArray()
    return res.render('index.pug', {posts})
})

app.all('/:slug', async (req,res) => {
    const {slug} = req.params
    const post = await db.collection('posts').findOne({slug})
    if(!post) return res.render('404.pug')

    const fecha = new Date(post.fecha).toLocaleDateString('es')
    const parsedPost = sanitizeHtml(marked.parse(post.post),{
        allowedTags:['img','h1','h2','h3','strong','i','a','strong','ul','li','ol','code','pre']
    })
    return res.render('post.pug',{post, parsedPost, fecha})
})

app.all('*', (req, res) => res.render('404.pug'))

app.use((err, req, res, next) => {
    return res.render('500.pug')
})

const startServer = async () => {
    try {
        await client.connect()
        console.log("Conectado a Mongo exitosamente.")
        app.listen(PORT, () => {
            console.log(`Servidor funcionando en: http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log("Algo salió mal!!! \n", error)
    }
}

startServer()