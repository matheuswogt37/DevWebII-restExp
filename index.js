const express = require('express')
require('dotenv').config()


const app = express();
app.use(express.json());

// environment const
const port = process.env.PORT;
const jwt_secret_key = process.env.JWT_SECRET_KEY;
const pageSize = process.env.PAGE_SIZE;

// db stuffs
const users = [
    {
        id: "1",
        name: "Manuel",
        email: "manuel2024@gmail.com",
        password: "paodebatata24"
    }
]
let userIdCont = 1;

const product = [
    {
        name: "Empadinha de frango",
        image: "https://picsum.photos/250/250",
        price: "15,50"
    },
    {
        name: "Macarronada",
        image: "https://picsum.photos/250/250",
        price: "23,00"
    },
    {
        name: "Sanduiches light",
        image: "https://picsum.photos/250/250",
        price: "25,99"
    },
    {
        name: "Pão de queijo",
        image: "https://picsum.photos/250/250",
        price: "7,50"
    },
    {
        name: "Café preto s/leite",
        image: "https://picsum.photos/250/250",
        price: "5,00"
    },
    {
        name: "Energético Monster branco",
        image: "https://picsum.photos/250/250",
        price: "9,70"
    }
]

const orders = [

]
const ordersIdCont = 0;

// db functions
// db User
function newUser(name, email, password) {
    users.push(++userIdCont, name, email, password);

    return 0;
}

function readUser(id) {
    return users.find(x => x.id == id);
}

function alterUser(id, name, email, password) {
    const index = users.findIndex(x => x.id == id)
    const user = {
        id: id,
        name: name,
        email: email,
        password: password
    }
    users[index] = user;

    return 0;
}

function deleteUser(id) {
    users = users.filter(x => x.id != id);
    
    return 0;
}

function validateUser(username, password) {
    if (users.find(x => x.name == username && x.password == password)) {
        return true;
    }
    return false;
}

function getUserByCred(username, password) {
    if (users.find(x => x.name == username && x.password == password)) {
        return user;
    }
    return null;
}

// db Product
function readProduct(page, name) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    let returnProducts;

    if (name) {
        returnProducts = products.filter(x=> name.includes(x.name));
    } else {
        returnProducts = products;   
    }

    if (returnProducts.length > pageSize) {
        returnProducts = returnProducts.slice(startIndex, endIndex);
    }

    return returnProducts;
}

// db Order
function newOrder(userId, customerTable, products, timestamp, extra) {
    const order = {
        id: ++ordersIdCont,
        userId: userId,
        customerTable: customerTable,
        products: products,
        timestamp: timestamp,
        notes: extra
    }

    orders.push(order);
    return 0;
}

function readOrders(userId) {
    return orders.filter(x=> x.userId == userId);
}

function alterQuantityOrder(orderId, productIndex, newQtd) {
    orders.find(x => x.id == orderId).products[productIndex].quantity = newQtd; 
    return 0;    
}

function deleteProductOrder(orderId, productIndex) {
    orders.find(x => x.id == orderId).products.slice(++productIndex);
    return 0;
}

// jwt functions

function verifyToken(req, res, next) {
    const { token } = req.body.auth;

    if (!token) return res.status(401).json({ message: "Please login before make anything" });

    try {
        const payload = jsonwebtoken.verifyToken(token, jwt_secret_key);
        const userFromToken = typeof payload !== 'string' && payload.user;
        
        if (!userFromToken) {
            return res.send(401).json({ message: "Invalid Token!" });
        }
        const user = getUserByCred(userFromToken.username, userFromToken.password);
        if (!user) {
            return res.send(401).json({ message: "Invalid Token!" });
        }

        req.body.user = payload.user;

        return next();
    } catch(error) {
        console.log(error);
        return res.json({ message: "Error! Please contact suport"});
    }
}

// routes
// users
app.get('/login', (req, res) => {
    const { username, password } = req.body.auth;

    try {

        if (!validateUser(username, password)) {
            return res.status(401).json({ message: "Username or password wrong! Please try again"});
        }
        
        const token = jsonwebtoken.sign(
            { user: JSON.stringify({ id: id, name: username, password: password })}, 
            jwt_secret_key,
            { expiresIn: '5m' }
        );
        
        return res.status(200).json({ data: {user, token}})
    } catch (error) {
        console.log(error);
        return res.json({ message: "Error! Please contact suport"});
    }
})

app.post('/user', (req, res) => {
    const { name, email, password } = req.body.auth;
    if (!name && !email && !password) res.status(401).json({ message: "Missing some data, please try again with all data required!"});

    users.push(++userIdCont, name, email, password);
    res.status(201).json({ message: "User successfully created!"});
})

app.use('*', verifyToken)

app.get('/user', (req, res) => {
    const user = req.body.user;
    res.status(200).json({ name: user.name, email: user.email });
})

app.put('/user', (req, res) => {
    const { name, email, password } = req.body.alter;
    users[users.findIndex(req.body.user.id)] = { id: req.body.user.id, name: name, email: email, password: password}
    res.status(200).json({ message: "User update success"});
})

app.delete('/user', (req, res) => {
    delete users[users.findIndex(req.body.user.id)];
    res.status(204).json({ message: "User deleted with success"});
})

// products
app.get('/', (req, res) => {
    res.status(200).json(JSON.stringify(readProduct(req.body.page, null)))
})

// orders
app.get('/order', (req, res) => {
    res.status(200).json(JSON.stringify(readOrders(req.body.user.id)));
})

app.post('/order', (req, res) => {
    newOrder(req.body.user.id, req.body.order.table, req.body.order.products, Date.now(), req.body.order.extra);
    res.status(200).json({ message: "New order create with success" });
})

app.patch('/order/quantity', (req, res) => {
    alterQuantityOrder(req.body.order.id, req.body.order.productId, req.body.order.newQtd);
    res.status(200).json({ message: "Order product update with success"});
})

app.delete('/order', (req, res) => {
    deleteProductOrder(req.body.order.id, req.body.order.productId);
    res.status(204).json({ message: "Product deleted with success"});
})

// server listen
app.listen(port, () => {
    console.log(`Server running at ${port}`)
})