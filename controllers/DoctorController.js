import connection_db from '../connection.js'


// INDEX FUNCTION TO SHOW ALL DOCTORS
function index(req, res) {

    // CREAZIONE DELLA QUERY SQL
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

        // GESTIONE ERRORI
        if (err) { return res.status(500).json({ error: 'Internal error server' }) }
        if (results.length === 0) { return res.status(200).json({ message: 'No doctors Available' }) }

        // GESTIONE RISPOSTA CON SUCCESSO
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

        if (err) { return res.status(500).json({ error: 'Internal error server' }) } //Se c'è un errore ritorna un error 500
        if (!results[0]) return res.status(404).json({ error: "Doctor not found" }); //Se l'elemento non è presente ritorna un error 404

        //Altrimenti ritorna l'elemento ma prima dobbiamo estrarre le sue reviews
        if (results[0]) {

            const sqlDoctorReviews = `SELECT * FROM reviews
            WHERE id_doctor = ?`; //preparo la query
            const doctor = results[0]; //salvo il dottore nella variabile doctor

            // Esecuzione query per le reviews
            connection_db.query(sqlDoctorReviews, [id], (err, results2) => {
                if (err) return res.status(500).json({ error: err }); //Se c'è un errore ritorna un error 500
                doctor.reviews = results2;  //Salvo le reviews nella variabile reviews
                return res.json(doctor); //Ritorno l'elemento con le reviews aggiunte
            });
        };
    });
};

function storeDoctor(req, res) {

    const { name, surname, email, phone } = req.body
    const sqlAddDoctor = `INSERT INTO doctors (name, surname, email, phone, office_address, serial_number) VALUES 
                          (?,?,?,?,?,?)`
    connection_db.query(sqlAddDoctor, [name, surname, email, phone, office_address, serial_number], (err, results2) => {
        if (err) return res.status(500).json({ error: err }); //Se c'è un errore ritorna un error 500
        return res.status(200)
    })
}

function storeReview(req, res) {
    const id = parseInt(req.params.id)
    const { vote, description } = req.body;
    const sqlAddReview = ` INSERT INTO reviews (vote, description, id_doctor)
            VALUES (?,?,?)`
    connection_db.query(sqlAddReview, [vote, description, id], (err, results) => {

        if (err) { return res.status(500).json({ error: 'Internal error server' }) }
        return res.status(200)

    })

}


function destroyDoctor(req, res) {

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

function destroyReview(req, res) {

    const id = req.params.id
    const sqlSingleReview = `DELETE FROM reviews WHERE id = ?`

    connection_db.query(sqlSingleReview, [id], (err, results) => {

        if (err) { return res.status(500).json({ error: 'Internal error server' }) }

        if (results.effectedRows !== 1) {
            return res.status(400).json({ error: 'Is not possible delete this review, beacause he does not exist' })
        }

        res.json({ review: results })

    })

}

export { index, show, storeReview, storeDoctor, destroyDoctor, destroyReview }
