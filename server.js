const express = require('express');
var bodyParser  = require('body-parser');
const app = express(),
      port = 8080;

const users = [];

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(process.cwd()+"/SpanishFortLodge/dist/spanish-fort-lodge/"));

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/user', (req, res) => {
  const user = req.body.user;
  users.push(user);
  res.json("user addedd");
});

app.get('/', (req,res) => {
  res.sendFile(process.cwd()+"/SpanishFortLodge/dist/spanish-fort-lodge/index.html")
});

app.listen(port, (err) => {
   if(err) {
     console.log(err)
   }
    console.log(`Server listening on the port:!!!::${port}`);
});
