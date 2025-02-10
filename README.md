1 creaziopne main script "server.js"
bash: ni server.js

2 creazione scafolding backend
bash: npm init -y

3 creazione .env e inizializziamo le variabili d'ambiente
bash: ni .env 

4 attribuzione alias al main sript aggiungendo a quest'ultimo gli attributi necesssaai per il refrech automatico e la possibilità di importare variabili variabili d'ambiente dal file .env
pakage.jsone: 
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
        -import express from "express";
        -import { index, show, store, destroy } from "../controllers/<...>Controller.js";
        -const <...>Router = express.Router();
    9.5 creazione rotte 
        -index: <...>Router.get("/", index);
        -show: <...>Router.get("/:id", show);
        -store: <...>Router.post("/", store);
        -destroy: <...>Router.delete("/:id", destroy);
    9.6 esportazione <...>Router
        -export default doctorRouter;

10 collegamento database
    10.1

e niente...



        

    

