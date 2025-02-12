import connection_db from '../connection.js'


// INDEX FUNCTION TO SHOW ALL DOCTORS
function index(req, res) {

    const sql = ` SELECT  doctors.*, AVG(reviews.vote) AS "vote_avarage" FROM doctors
                  JOIN reviews ON doctors.id = reviews.id_doctor
                  GROUP BY doctors.id 
                  ORDER BY vote_avarage DESC`

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


function storeDoctor(req, res) {
    res.send('sono post')
}

function storeReview(req, res) {
    res.send('sono post')
}


function destroyDoctor(req, res) {

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

function destroyReview(req, res) {

    const id = req.params.id
    const sqlSingleReview = `DELETE FROM reviews WHERE id = ?`

    connection_db.query(sqlSingleReview, [id], (err, results) => {

        if (err) { return res.status(500).json({ error: 'Internal error server' }) }

        if (results.effectedRows !== 1) {
            return res.status(400).json({ error: 'Is not possible delete this review, beacause he does not exist' })
        }

        res.json(
            {
                review: results,
            }
        )

    })
}

export { index, show, storeReview, storeDoctor, destroyDoctor, destroyReview }
