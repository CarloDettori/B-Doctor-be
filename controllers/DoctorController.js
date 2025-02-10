import connection_db from "../connection";

function index(req, res) {
    const sql = "SELECT *.doctors, AVG(vote.reviews) AS  FROM doctors,  "
    res.send("sono get")
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