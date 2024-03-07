const express = require('express')
const app = express() 
const db = require('./db')

app.use(express.json()) 

// Get users 
app.get('/api/users', async (req, res) => {
    try {
        const users = await db.fetchUsers() 
        res.json(users)
    } catch (error) {
        res.status(500).json({error: 'Server Error'})
    }
})

// Get products 
app.get('/api/products', async (req, res) => {
    try {
        const products = await db.fetchProducts() 
        res.json(products) 
    } catch (error) {
        res.status(500).json({error: 'Server Error'})
    }
})

// Get favorites 
app.get('/api/users/:id/favorites', async (req, res) => {
    const userId = req.params.id 
    try {
        const favorites = await db.fetchFavorites() 
        res.json(favorites) 
    } catch (error) {
        res.status(500).json({error: 'Server Error'})
    }
})

// Post favorites 
app.post('/api/users/:id/favorites', async (req, res) => {
    const userId = req.params.id 
    const productId = req.body.product_id 
    try {
        const favorite = await db.createFavorite(userId, productId)
        req.status(201).json(favorite)
    } catch (error) {
        console.error(error) 
        res.status(500).json({error: 'Server Error'})
    }
})

// Delete favorites 
app.delete('/api/users/:userId/favorites/:id', async (req, res) => {
    const userId = req.params.userId 
    const favoriteId = req.params.id 
    try {
        await db.destroyFavorite(userId, favoriteId)
        res.sendStatus(204)
    } catch (error) {
        console.error(error) 
        res.status(500).json({error: 'Server Error'})
    }
})


const PORT = process.env.PORT || 3000 
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

const init = async () => {
    console.log('Connected to database')
    try {
        await db.client.connect() 
        console.log('Connected to database')
        await db.createTables() 
        console.log('Tables created')
    } catch (error) {
        console.error('Error connecting to database:', error)
    }
}

init() 

module.exports = app 