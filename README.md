1 creaziopne main script "server.js"
bash: ni server.js

2 creazione scafolding backend
bash: npm init -y

3 creazione .env e inizializziamo le variabili d'ambiente
bash: ni .env 

4 attribuzione alias al main sript aggiungendo a quest'ultimo gli attributi necesssaai per il refrech automatico e la possibilità di importare variabili variabili d'ambiente dal file .env
pakage.jsone:
package-json.js 
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "server": "node --watch --env-file=.env server.js"
    },

5 installazione pacchetti necessari
bash:
    -npm install 
    -npm install express (libreria back end)
    -npm install cors (middleware per i permessi di acesso al server)
    -npm install mysql2 (collegamento db)

6 settaggio documento al fine di utilizzare la sintassi ES6 di js ("type" :"module" sotto "main": "server.js",)

7 eseguiamo i passaggi di base per rendere il nostro script funzionale
server.js:
    7.1 importazione libreria/contenuti principali:
        -import express from "express" (importiamo express)
        -import cors from "cors"
    7.2 inizializziamo le variabili principali:
        -const server = express ()
        -const PORT = process.env.PORT || 3000; ()
    7.3 utiliziamo i middleware necessari come:
        -server.use(express.static("public")); (middleware)  OPTIONAL
        -server.use(cors())
        -server.use(express.json())
        -server.get("/", (req, res) => {res.send("Home Page");});
    7.4 impostiamo le rotte principali:
        -server.get("/home", (req, res) => {res.send("Home Page");}); (rotta principale home)
        -server.get("*", (req, res) => {res.send("Tutte Le Rotte");}); (tutte le altre rotte)
    7.5 creiamo il collegameto al server:
        -server.listen(PORT, () => {console.log(`Server is running on http://localhost:${PORT})}`);});

8 creazione di controllers   
    8.1 creazione cartella routes 
    8.2 creazione file <...>Controller
    8.3 creazione rotte
    controller.js:
        -index: function index(req, res) {res.send("sono get")};
        -show: function show(req, res) {res.send("sono getID")}
        -store: function store(req, res) {res.send("sono post")}
        -destroy: function destroy(req, res) {res.send("sono delete")}
    8.4 esportazione rotte dal controller
        -export {index, show, store, destroy}

9 creazione delle rotte
    9.1 creazione cartella routes 
    9.2 creazione file <...>Router
    9.4 inizializzazione variabili e importazioni necessarie
    routes.js:
        -import express from "express";
        -import { index, show, store, destroy } from "../controllers/<...>Controller.js";
        -const <...>Router = express.Router();
    9.5 creazione rotte 
        -index: <...>Router.get("/", index);
        -show: <...>Router.get("/:id", show);
        -store: <...>Router.post("/", store);
        -destroy: <...>Router.delete("/:id", destroy);
    9.6 esportazione <...>Router
        -export default <...>Router;

10 collegamento database
    10.1 creazione database
    10.2 creazione file connection.js
    10.3 collegamento connection.js al database
    connection.js:
        10.3.1 collegamento db tramite file .env
            -import mysql from "mysql2"
            -const connection_db = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                name: process.env.DB_NAME
            });
        10.3.2 gestione errori
            -connection_db.connect((err) => {
                if (err) throw err
                console.log("connection to database completed!")
            });
        10.3.3 esportazione
            -export default connection_db

11 definizione chiamate al server per le rotte crud
    11.1 INDEX
    <...>Controller.js > function index(req, res) {qui...}
        11.1.1 aggiungo variabile di chiamata (sql) per definire la richiesta
            -const sql = `SELECT * FROM people`
        11.1.2 definizione gestione risposta in formato .json
            -connection_db.query(sql, (err, results) => {
                res.json({
                    lenght: results.lenght,
                    people: results
                })
            })
    11.2 SHOW
    <...>Controller.js > function show(req, res) {qui...}
        11.2.1 aggiungo variabile di chiamata (sql) per definire la richiesta
            -const sql = `SELECT id, names, surname, age FROM people WHERE people.id = ?`  
        11.2.2 definizione gestione risposta in formato .json
            -connection_db.query(sql, (err, results) => {
                res.json({
                    doctor: results
                })
            })
    11.3 STORE
    <...>Controller.js > function store(req, res) {qui...}
        11.3.1 aggiungo variabile di chiamata (sql) per definire la richiesta
            -const sql = `INSERT INTO id, names, surname, age FROM people WHERE people.id = ?`
        11.3.2 definizione gestione risposta in formato .json
            -connection_db.query(sql, (err, results) => {
                res.json({
                    lenght: results.lenght,
                    doctors: results
                })
            })
    11.4 DESTROY
    <...>Controller.js > function destroy(req, res) {qui...}
        11.4.1 aggiungo variabile di chiamata (sql) per definire la richiesta
            -const sql = `DROP INDEX people.id = ? FROM people WHERE people.id = ?`
        11.4.2 definizione gestione risposta in formato .json
            -connection_db.query(sql, (err, results) => {
                res.json({
                    lenght: results.lenght,
                    doctors: results
                })
            })
            

e niente...



        

    

