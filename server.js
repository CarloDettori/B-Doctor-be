import express from "express"
import cors from "cors"
import doctorRouter from "./routers/DoctorRouter.js"
const URL = process.env.URL
const PORT = process.env.PORT || 3000
const server = express()

//midlewares
server.use(cors())
server.use(express.json())
server.use(express.static("public"))

//main routes
server.use("/doctors", doctorRouter)
server.get("*", (req, res) => {
    res.send("SONO TUTTE LE ROTTE")
})

//ascolto server
server.listen(PORT, (req, res) => {
    console.log(`server in ascolto nella porta ${URL}`)
})


