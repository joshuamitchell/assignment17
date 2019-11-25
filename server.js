"using strict"

const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bands', {useUnifiedTopology:true, useNewUrlParser:true})
.then(()=> console.log("Connected to mongodb..."))
.catch((err => console.error("could not connect ot mongodb...", err)));

const bandSchema = new mongoose.Schema({
    name:String,
    genre:String,
    date:Number,
    active:String,
    members:[String],
    songs:[String]
});

const Band = mongoose.model('Band', bandSchema);

async function createBand(band){
    const result = await band.save();
    console.log(result);
}

/*
const testBand = new Band({
    name:"Fleet Foxes",
    genre:"Indie Folk",
    date:2006,
    active:"Yes",
    members:["Robin Pecknold", "Skyler Skjelset", "Casey Wescott", "Christian Wargo", "Morgan Henderson"],
    songs:["Montezuma", "Mykonos", "If You Need To, Keep Time On Me", "White Winter Hymnal"]
});
createBand(testBand);
*/

function validateBand(band){
    const schema = {
        name:Joi.string().min(3).required(),
        genre:Joi.string(),
        date:Joi.number(),
        active:Joi.string(),
        members:Joi.allow(),
        songs:Joi.allow()
    };

    return Joi.validate(band, schema);
}

app.post('/api/bands', (req,res)=>{
    const result = validateBand(req.body);

    if(result.error){
        res.status(400).send(result.err.details[0].message);
        return;
    }

    const band = new Band({
        name:req.body.name,
        genre:req.body.genre,
        date:Number(req.body.date),
        active:req.body.active,
        members:req.body.members,
        songs:req.body.songs
    });

    createBand(band);
    res.send(band);
});


//render our html page
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

async function getBands(res){
    const bands = await Band.find();
    console.log(bands);
    res.send(bands);
}

app.get('/api/bands',(req,res)=>{
    const bands = getBands(res);
});

app.get('/api/bands/:id',(req,res)=>{
    let band = getBand(req.params.id,res)
})

async function getBand(id,res){
    const band = await Band
    .findOne({_id:id});
    console.log(band);
    res.send(band);
}

app.put('/api/bands/:id',(req,res)=>{
    //validate 
    //if invalid return 400 - bad request
    const result = validateBand(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateBand(res, req.params.id, req.body.name, req.body.genre, req.body.date, req.body.active, req.body.members, req.body.songs);
});

async function updateBand(res, id, name, genre, date, active, members, songs) {
    //fist param: to find, second update
    const result = await Band.updateOne({_id:id},{
        $set:{
            name:name,
            genre:genre,
            date:Number(date),
            active:active,
            members:members,
            songs:songs
        }
    })
    
    res.send(result);
}

app.delete('/api/bands/:id',(req,res)=>{
    removeBand(res, req.params.id);
});

async function removeBand(res, id) {
    //can also use delete many
    //const result = await Course.deleteOne({_id:id});
    const band = await Band.findByIdAndRemove(id);
    res.send(band);
}

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});