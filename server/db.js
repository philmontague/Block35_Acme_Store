const pg = require('pg')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_store_db')
const bcrypt = require('bcrypt')

const createTables = async () => {
    const SQL = ` 
        DROP TABLE IF EXISTS favorites; 
        DROP TABLE IF EXISTS products; 
        DROP TABLE IF EXISTS users; 

        CREATE TABLE users ( 
            id SERIAL PRIMARY KEY, 
            username VARCHAR(100) NOT NULL UNIQUE, 
            password TEXT NOT NULL 
        ); 

        CREATE TABLE products (
            id SERIAL PRIMARY KEY, 
            name VARCHAR(255) NOT NULL, 
            description TEXT, 
            price DECIMAL(10, 2) NOT NULL
        ); 

        CREATE TABLE favorites (
            id SERIAL PRIMARY KEY, 
            user_id INT REFERENCES users(id) ON DELETE CASCADE, 
            product_id INT REFERENCES products(id) ON DELETE CASCADE
        ); 
    `
    await client.query(SQL) 
}

// Create User
const createUser = async ({ username, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10) 
    const SQL = `INSERT INTO users(username, password) VALUES($1, $2) RETURNING *;`
    const response = await client.query(SQL, [username, hashedPassword])
    return response.rows[0]
}

// Fetch Users 
const fetchUsers = async () => {
    const SQL = `SELECT * FROM users;`
    const response = await client.query(SQL) 
    return response.rows 
}

// Create Product 
const createProduct = async ({ name, description, price }) => {
    const SQL = `INSERT INTO products(name, description, price) VALUES($1, $2, $3) RETURNING *;`
    const response = await client.query(SQL, [name, description, price])
    return response.rows[0]
}

// Fetch Products
const fetchProducts = async () => {
    const SQL = `SELECT * FROM products;`
    const response = await client.query(SQL) 
    return response.rows 
}

// Create Favorites 
const createFavorite = async (userId, productId) => {
    const SLQ = 'INSERT INTO favorites(user_id, product_id) VALUES($1, $2) RETURNING *;'
    const response = await client.query(SQL, [userId, productId])
    return response.rows[0]
}

// Fetch Favorites 
const fetchFavorites = async (userId) => {
    const SQL = `SELECT * FROM favorites WHERE user_id = $1;`
    const response = await client.query(SQL, [userId])
    return response.rows 
}

// Destroy Favorites 
const destroyFavorite = async (userId, favoriteId) => {
    const SQL = `DELETE FROM favorites WHERE user_id = $1 AND id = $2;`
    await client.query(SQL, [userId, favoriteId])
}

module.exports = {
    client, 
    createTables,
    createUser, 
    fetchUsers, 
    createProduct, 
    fetchProducts,
    fetchFavorites, 
    createFavorite, 
    destroyFavorite
}

