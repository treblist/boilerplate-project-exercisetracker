const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
let bodyParser = require("body-parser");
//let dns = require("node:dns");
app.use(bodyParser.urlencoded({extended:false}));

let users = []
let logs = []

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get("/api/users", (req,res)=>{
    res.json(users);
})
app.post("/api/users", (req,res)=>{
    let data = {username:req.body.username, _id:String(users.length)};
    let data1 = {...data, count:0, log:[]};
    users.push(data);
    logs.push(data1);
    res.json(data);
})

app.get("/api/users/:_id/logs", (req,res)=>{
let data = {...logs[req.params._id]}

  let filteredLogs = data.log;
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;

  if (from) {
    const fromTime = new Date(from).getTime();
    filteredLogs = filteredLogs.filter(log => new Date(log.date).getTime() >= fromTime);
  }


  if (to) {
    const toTime = new Date(to).getTime();
    filteredLogs = filteredLogs.filter(log => new Date(log.date).getTime() <= toTime);
  }


  if (limit) {
    filteredLogs = filteredLogs.slice(0, parseInt(limit, 10));
  }

data.log = filteredLogs

res.json(data);
})
app.post("/api/users/:_id/exercises", (req,res)=>{
    let data = {
        description : req.body.description,
        duration : Number(req.body.duration),
        date : req.body.date ? (new Date(req.body.date)).toDateString() : (new Date()).toDateString(),
    }
    logs[req.params._id].log.push(data);
    logs[req.params._id].count++;
    res.json({...data, ...users[req.params._id]})
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
