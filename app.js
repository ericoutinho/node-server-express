const express = require("express")
const { randomUUID } = require("crypto")
const fs = require("fs")

const App = express()
App.use(express.json())

let products = []

fs.readFile("products.json", "utf-8", (error, data) => {
    if (error) {
        console.log( error )
    } else {
        products = JSON.parse(data)
    }
})

App.post("/products", (req, res) => {
    const {name, price} = req.body
    const product = {
        name,
        price,
        id: randomUUID()
    }
    products.push( product )
    writeProducts()
    return res.status(200).json( product )
})

App.get( "/products", (req, res) => {
    return res.status(200).json( products )
})

App.get( "/products/:id", (req, res) => {
    const { id } = req.params
    const product = products.find( product => product.id === id )
    return res.status(200).json( product )
})

App.put( "/products/:id", (req,res) => {
    const {id} = req.params
    const {name, price} = req.body
    const productIndex = products.findIndex( product => product.id === id )
    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    }
    writeProducts()
    return res.status(200).json( { message: 'Produto alterado com sucesso' } )
})

App.delete( "/products/:id", (req,res) => {
    const {id} = req.params
    const productIndex = products.findIndex( product => product.id === id )
    products.splice(productIndex, 1)
    writeProducts()
    return res.status(200).json( { message: 'Produto excluido com sucesso' } )
})

function writeProducts() {
    fs.writeFile("products.json", JSON.stringify(products, null, 1), (error) => {
        if (error) {
            console.log(error)
        }
    })
}

App.listen(3000, () => {
    console.log("Server at port 3000")
})