import connection_db from '../connection.js'


// INDEX FUNCTION TO SHOW ALL DOCTORS
function index(req, res) {

    // CREAZIONE DELLA QUERY SQL PER MOSTRARE LA LISTA DEI DOTTORI E LE SUE RECENSIONI CORRELATE
    const sql = `SELECT 
    doctors.*, 
    GROUP_CONCAT(DISTINCT specializations.name ORDER BY specializations.name SEPARATOR ', ') AS specializations,
    AVG(reviews.vote) AS vote_average 
    FROM doctors
    LEFT JOIN reviews ON doctors.id = reviews.id_doctor
    LEFT JOIN x_doctor_specialization ON doctors.id = x_doctor_specialization.id_doctor
    LEFT JOIN specializations ON specializations.id = x_doctor_specialization.id_specialization
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

function indexSpecialization(req, res) {

    // CREAZIONE DELLA QUERY SQL PER MOSTRARE LA LISTA DEI DOTTORI E LE SUE RECENSIONI CORRELATE
    const sql = `SELECT * FROM specializations`

    connection_db.query(sql, (err, results) => {

        // GESTIONE ERRORI
        if (err) { return res.status(500).json({ error: 'Internal error server' }) }
        if (results.length === 0) { console.log(results); return res.status(200).json({ message: 'No Specialization Available' }) }

        // GESTIONE RISPOSTA CON SUCCESSO
        return res.json(
            {
                length: results.length,
                specializations: results,
            }
        )
    })
}



// SHOW FUNCTION TO SHOW SINGLE DOCTOR
function show(req, res) {

    const id = parseInt(req.params.id);

    const sqlSingleDoctor = ` SELECT DISTINCT doctors.*, COALESCE(AVG(reviews.vote), 0) AS vote_average, GROUP_CONCAT(DISTINCT CONCAT(specializations.name) SEPARATOR " | ") AS specializations FROM doctors
    LEFT JOIN reviews ON doctors.id = reviews.id_doctor
    LEFT JOIN x_doctor_specialization ON doctors.id = x_doctor_specialization.id_doctor
    LEFT JOIN specializations ON specializations.id = x_doctor_specialization.id_specialization
    WHERE doctors.id = ?
    GROUP BY doctors.id`

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

function showSpecialization(req, res) {

    const id = parseInt(req.params.id);

    const sqlSingleDoctor = `SELECT * 
                                FROM specializations
                                HAVING specializations.id = ?;`

    connection_db.query(sqlSingleDoctor, [id], (err, results) => {

        if (err) { return res.status(500).json({ error: 'Internal error server' }) } //Se c'è un errore ritorna un error 500
        if (!results[0]) return res.status(404).json({ error: "Doctor not found" }); //Se l'elemento non è presente ritorna un error 404

        //Altrimenti ritorna l'elemento ma prima dobbiamo estrarre le sue reviews
        if (results[0]) {

            const sqlSpecializationDoctors = `SELECT doctors.* FROM doctors
	                                    JOIN x_doctor_specialization ON doctors.id = x_doctor_specialization.id_doctor
	                                    WHERE id_specialization = ?`; //preparo la query
            const specialization = results[0]; //salvo il dottore nella variabile doctor

            // Esecuzione query per le reviews
            connection_db.query(sqlSpecializationDoctors, [id], (err, results2) => {
                if (err) return res.status(500).json({ error: err }); //Se c'è un errore ritorna un error 500
                specialization.doctors = results2;  //Salvo le reviews nella variabile reviews
                return res.json(specialization); //Ritorno l'elemento con le reviews aggiunte
            });
        };
    });
};

function storeDoctor(req, res) {

    const { name, surname, email, phone, office_address, serial_number } = req.body

    if (name.trim().length < 3) {
        return res.json({ error: 'The name must contain at least 3 characters' })
    } else if (surname.trim().length < 3) {
        return res.json({ error: 'The surname must contain at least 3 characters' })
    } else if (!email.includes('@') || !email.includes('.')) {
        return res.json({ error: 'The email must contain at least one "@" and a "."' })
    } else if (phone.trim().length < 11 || phone.trim().length > 15) {
        return res.json({ error: 'A telephone number is made up of numbers between 10 and 15' })
    } else if (isNaN(phone)) {
        return res.json({ error: 'The telephone number can only consist of numbers' })
    } else if (serial_number.trim().length !== 7) {
        return res.json({ error: 'The serial number must be 7 characters' })
    }

    const sqlAddDoctor = `INSERT INTO doctors (name, surname, email, phone, office_address, serial_number) VALUES ("?","?","?","?","?","?")`

    connection_db.query(sqlAddDoctor, [name, surname, email, phone, office_address, serial_number], (err, results2) => {
        if (err) return res.status(500).json({ error: err });
        if (results2.affectedRows === 0)
            return res.status(404).json({ error: "Cannot add doctors" })
        if (results2.affectedRows === 1)
            return res.status(200).json({ success: "Doctor added with success" })
    })
}

function storeReview(req, res) {

    // Recuperiamo l'id dalla url che ci servirà per trovare l'id specifico del medico al quale vogliamo lasciare la recensione.
    const id = parseInt(req.params.id)

    // Destrutturiamo il body della richiesta.
    let { name_patient, vote, description } = req.body;

    // 1) CONTROLLO SUL CONTENUTO DEL NOME
    name_patient = name_patient && name_patient.trim() ? name_patient : "Anonymous"
    if (name_patient.length < 3) // Se la lunghezza del testo inserito è minore di 3 allora ritorna errore
        return res.status(400).json({ error: 'The length name must be min. 3 characters' });

    // 2) CONTROLLI SUI VOTI 
    if (!vote || isNaN(vote) || vote < 1 || vote > 10) {
        return res.status(400).json({ error: 'The vote must be a number between 1 to 10' });
    }

    // 3) CONTROLLO SULLA LUNGHEZZA DEI CARATTERI DELLA DESCRIZIONE E SUL CONTENUTO
    description = description && description.trim() ? description : "No content available"
    if (description.length > 5000)
        return res.status(400).json({ error: 'The text must have max 5000 characters' });


    const sqlAddReview = ` INSERT INTO reviews (name_patient, vote, description, id_doctor)
            VALUES (?,?,?,?) `

    connection_db.query(sqlAddReview, [name_patient, vote, description, id], (err, results) => {

        if (err) { return res.status(500).json({ error: err }) }
        if (results.affectedRows === 0)
            return res.status(404).json({ error: "Cannot add review" })
        if (results.affectedRows === 1)
            return res.status(200).json({ success: "Review added with success" })

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

        if (results.affectedRows !== 1) {
            return res.status(400).json({ error: 'Is not possible delete this review, beacause he does not exist' })
        }

        res.json({ review: results })

    })

}

export { index, indexSpecialization, show, showSpecialization, storeReview, storeDoctor, destroyDoctor, destroyReview }
