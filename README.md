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

8 creazione routing
    8.1creazione cartella routes
    8.2creazione


        

    

