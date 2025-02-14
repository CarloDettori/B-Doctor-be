import express from "express"
import cors from "cors"
import { doctorRouter, specializationsRouter } from "./routers/DoctorRouter.js"
const URL = process.env.URL
const PORT = process.env.PORT || 3000
const server = express()

// Middlewares per gestione accessi, parsing e accesso alle risorse statiche
server.use(cors())
server.use(express.json())
server.use(express.static("public"))

// Rotta doctors e rotta generica 
server.use("/doctors", doctorRouter)
server.use("/specializations", specializationsRouter)
server.get("*", (req, res) => {
    res.send("SONO TUTTE LE ROTTE")
})

// Connessione di ascolto al server sulla porta 3000
server.listen(PORT, (req, res) => {
    console.log(`server in ascolto nella porta ${URL}`)
})


