import connection_db from "../connection.js";

function index(req, res) {
    const sql = `SELECT *.doctors, AVG(vote.reviews) AS doctor_average FROM doctors
    JOIN reviews
    ON doctors.id = rewiews.id_doctor
    ORDERED BY doctor_average DESC`
    connection_db.query(sql, (err, results) => {
        res.json({
            lenght: results.lenght,
            doctors: results
        })
    })
}
function show(req, res) {
    res.send("sono getID")
}
function store(req, res) {
    res.send("sono post")
}
function destroy(req, res) {
    res.send("sono delete")
}

export {
    index,
    show,
    store,
    destroy
}