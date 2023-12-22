const express = require('express')
const app = express()
const cors = require('cors')
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000



app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))








const uri = process.env.Url;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const taskCollection = client.db("taskDB").collection('tasks')
        const userCollection = client.db("taskDB").collection('users')

        // user post 
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result)


        })

        // task post 
        app.post('/task', async (req, res) => {
            const taskData = req.body;
            const result = await taskCollection.insertOne(taskData)
            res.send(result)


        })

        // task get 
        app.get('/tasks/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { user: email }
            const result = await taskCollection.find(filter).toArray()
            res.send(result)
        })

        app.patch('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const statusUpadte = req.body;

            const updateStatus = {
                $set: {
                    status: statusUpadte.status,
                }
            }

            const result = await taskCollection.updateOne(filter, updateStatus)
            res.send(result)
        })

        // update task 
        app.patch('/taskUpdate/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const taskUpadte = req.body;

            const updateTask = {
                $set: {
                    title: taskUpadte.title,
                    description: taskUpadte.description,
                    taskDeadLine: taskUpadte.taskDeadLine,
                    taskPriority: taskUpadte.taskPriority,

                }
            }

            const result = await taskCollection.updateOne(filter, updateTask)
            res.send(result)
        })


        //task delete

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })

        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();d
        // // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Task Server is runing now ");
});

app.listen(port, () => {
    console.log(`Task Server Runnig On Port: ${port}`);
});


