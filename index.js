const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const { MongoClient, ObjectId } = require("mongodb");
const mongo = new MongoClient("mongodb://localhost");
const db = mongo.db("todo");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/students", async(req, res) => {
    const students = await db.collection("students").find().toArray();
    res.json(students);
})

app.get("/students/:id", async(req, res) => {
    const { id } = req.params;

    const student = await db.collection("students").findOne({
        _id: ObjectId(id)
    });

    res.json(student);
})

app.post("/students/create-student", async(req, res) => {
    const { name, email, phone } = req.body;

    if(!name || !email || !phone) {
        return res.status(400).json({ msg: "name, email, phone: all required"});
    }

    const result = await db.collection("students").insertOne({
        name, email, phone
    });
    const student = await db.collection("students").findOne(
        { _id: ObjectId(result.insertedId) }
    );

    res.status(201).json(student);
});

app.put('/students/update-student/:id', async(req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if(!name){
        return res.status(400).json({ msg: "name required"});
    }

    const data = {};
    data.name = name;
    data.email = email;
    data.phone = phone;

    const result = await db.collection("students").updateOne(
        { _id: ObjectId(id) },
        { $set: data }
    );
    
    res.status(204).json(result);
});

app.delete("/students/delete-student/:id", async(req, res) => {
    const { id } = req.params;
    const result = await db.collection("students").deleteOne({
        _id: ObjectId(id),
    });

    res.status(204).json(result);
});

app.listen(8000, () => {
    console.log("API running at port 8000");
});