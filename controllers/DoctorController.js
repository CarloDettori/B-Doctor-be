import connection_db from '../connection.js'


// INDEX FUNCTION TO SHOW ALL DOCTORS
function index(req, res) {

    const sql = ` SELECT  doctors.*, AVG(reviews.vote) AS "vote_average" FROM doctors
                  JOIN reviews ON doctors.id = reviews.id_doctor
                  GROUP BY doctors.id 
                  ORDER BY vote_average DESC`

    connection_db.query(sql, (err, results) => {

        if (err) { return res.status(500).json({ error: 'Internal error server' }) }

        if (results.length === 0) { return res.status(200).json({ message: 'No doctors Available' }) }

        return res.json(
            {
                length: results.length,
                doctors: results,
            }
        )

    })
}

// SHOW FUNCTION TO SHOW SINGLE DOCTOR
function show(req, res) {

    const id = req.params.id

    const sqlSingleDoctor = ` SELECT  doctors.*, AVG(reviews.vote) AS "vote_avarage" FROM doctors
    JOIN reviews ON doctors.id = reviews.id_doctor
    GROUP BY doctors.id 
    HAVING doctors.id = ?`

    connection_db.query(sqlSingleDoctor, [id], (err, results) => {

        if (err) { return res.status(500).json({ error: 'Internal error server' }) }

        if (results.length === 0) { return res.status(200).json({ message: 'No doctor Available' }) }

        return res.json({ doctor: results })

    })

}


function store(req, res) {
    res.send('sono post')
}


function destroy(req, res) {

    const id = req.params.id
    const sqlSingleDoctor = `DELETE FROM doctors WHERE id = ?`

    connection_db.query(sqlSingleDoctor, [id], (err, results) => {

        if (err) { return res.status(500).json({ error: 'Internal error server' }) }

        if (results.effectedRows !== 1) {
            return res.status(400).json({ error: 'Is not possible delete this doctor, beacause he does not exist' })
        }

        res.json(
            {
                doctor: results,
            }
        )

    })
}

export { index, show, store, destroy }
