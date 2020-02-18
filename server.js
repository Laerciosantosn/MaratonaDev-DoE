const express =  require('express')
const server = express()

require("dotenv").config()

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
const dbHost = process.env.DB_HOST
const dbName = process.env.DB_NAME

server.use(express.static('public'))

server.use(express.urlencoded({extended: true}))

const Pool = require('pg').Pool

const db = new Pool({
  user: dbUser,
  password: dbPass,
  host: dbHost,
  port: 5432,
  database: dbName
})

const nunjucks = require('nunjucks')
nunjucks.configure('./', {
  express: server,
  noCache: true,
  autoescape: false,
})

const port = 3000

// configurar o servidor para apresentar arquivos extras

server.get('/', (req, res) =>{
  const query = "SELECT * FROM donors"
  db.query(`${query}`, function(err, result) {
   if(err) return res.send('Erro de banco de dados')

   const donors = result.rows
   return res.render('index.html', { donors })
})
  })
  // const donors = []
 

server.post('/',(req, res) => {
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood


  const keys = Object.keys(req.body)

  for(key of keys){
      if(req.body[key] == ''){
          return res.send('Preenca todos os campos')
      }
  }

  const query = `INSERT INTO donors ("name", "email", "blood")
  VALUES ($1, $2, $3)`
  
  const values =  [name, email, blood]
  db.query(query, values, function(err){
    if(err) return res.send('erro no banco de dados')

    return res.redirect('/')
  })
})

server.listen(port, ()=>{
  console.log(`Server is running in port: ${port}`)
})

module.exports = server