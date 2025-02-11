import connection_db from '../connection.js'


// INDEX FUNCTION TO SHOW ALL DOCTORS
function index(req, res) {

    const sql = ` SELECT 
    doctors.*, 
    GROUP_CONCAT(DISTINCT specializations.name ORDER BY specializations.name SEPARATOR ', ') AS specializations,
    AVG(reviews.vote) AS vote_average 
FROM doctors
JOIN reviews ON doctors.id = reviews.id_doctor
JOIN doc_spec ON doctors.id = doc_spec.id_doctor
JOIN specializations ON specializations.id = doc_spec.id_specialization
GROUP BY doctors.id 
ORDER BY vote_average DESC;`


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

    const id = parseInt(req.params.id);

    const sqlSingleDoctor = ` SELECT  doctors.*, AVG(reviews.vote) AS "vote_avarage" FROM doctors
    JOIN reviews ON doctors.id = reviews.id_doctor
    GROUP BY doctors.id 
    HAVING doctors.id = ?`

    connection_db.query(sqlSingleDoctor, [id], (err, results) => {
        //Se c'è un errore ritorna un error 500
        if (err) { return res.status(500).json({ error: 'Internal error server' }) }
        //Se l'elemento non è presente ritorna un error 404
        if (!results[0]) return res.status(404).json({ error: "Doctor not found" });
        //Altrimenti ritorna l'elemento ma prima dobbiamo estrarre le sue reviews
        if (results[0]) {
            //preparo la query
            const sqlDoctorReviews = `SELECT * FROM reviews
            WHERE id_doctor = ?`;
            //salvo il dottore nella variabile doctor
            const doctor = results[0];
            //Esecuzione query
            connection_db.query(sqlDoctorReviews, [id], (err, results2) => {
                //Se c'è un errore ritorna un error 500
                if (err) return res.status(500).json({ error: err });
                //Salvo le reviews nella variabile reviews
                doctor.reviews = results2;
                //ritorno l'elemento
                return res.json(doctor);
            });
        };
    });
};



function store(req, res) {
    res.send('sono post')
}


function destroy(req, res) {

    const id = parseInt(req.params.id)
    const sqlSingleDoctor = `DELETE FROM doctors WHERE id = ?`

    connection_db.query(sqlSingleDoctor, [id], (err, results) => {

        if (err) { return res.status(500).json({ error: 'Internal error server' }) }

        if (results.effectedRows !== 1) {
            return res.status(400).json({ error: 'Is not possible delete this doctor, beacause he does not exist' })
        }

        res.json({ doctor: results })

    })
}

export { index, show, store, destroy }
