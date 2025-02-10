import connection_db from '../connection.js'


// INDEX FUNCTION TO SHOW ALL DOCTORS
function index(req, res) {

    const sql = ` SELECT  doctors.*, AVG(reviews.vote) AS "vote_avarage" FROM doctors
                  JOIN reviews ON doctors.id = reviews.id_doctor
                  GROUP BY doctors.id `

    connection_db.query(sql, (err, results) => {

        if (err) { res.status(500).json({ error: 'Internal error server' }) }

        if (results.length === 0) { res.status(200).json({ message: 'No doctors Available' }) }

        res.json(
            {
                lenght: results.length,
                doctors: results,
            }
        )

    })
}




function show(req, res) {

    const id = req.params.id

    const sqlSingleDoctor = ` SELECT  doctors.*, AVG(reviews.vote) AS "vote_avarage" FROM doctors
    JOIN reviews ON doctors.id = reviews.id_doctor
    GROUP BY doctors.id 
    HAVING doctors.id = ?`

    connection_db.query(sqlSingleDoctor, [id], (err, results) => {

        if (err) { res.status(500).json({ error: 'Internal error server' }) }

        if (results.length === 0) { res.status(200).json({ message: 'No doctor Available' }) }

        res.json(
            {
                doctor: results,
            }
        )

    })

}



function store(req, res) {
    res.send('sono post')
}
function destroy(req, res) {
    res.send('sono delete')
}

export { index, show, store, destroy }
