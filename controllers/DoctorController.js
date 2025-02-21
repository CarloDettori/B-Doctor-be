import connection_db from '../connection.js'

// INDEX FUNCTION TO SHOW ALL DOCTORS
function index(req, res) {
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
        if (err) { return res.status(500).json({ error: 'Internal error server' }) }
        if (results.length === 0) { return res.status(200).json({ message: 'No doctors Available' }) }

        return res.json({
            length: results.length,
            doctors: results,
        })
    })
}

function indexSpecialization(req, res) {
    const sql = `SELECT * FROM specializations`

    connection_db.query(sql, (err, results) => {
        if (err) { return res.status(500).json({ error: 'Internal error server' }) }
        if (results.length === 0) { return res.status(200).json({ message: 'No Specialization Available' }) }

        return res.json({
            length: results.length,
            specializations: results,
        })
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
        if (err) { return res.status(500).json({ error: 'Internal error server' }) }
        if (!results[0]) return res.status(404).json({ error: "Doctor not found" });

        if (results[0]) {
            const sqlDoctorReviews = `SELECT id, name_patient, vote, description, DATE_FORMAT(creation_date, '%Y-%m-%d') AS creation_date FROM reviews WHERE id_doctor = ?;`
            const doctor = results[0];

            connection_db.query(sqlDoctorReviews, [id], (err, results2) => {
                if (err) return res.status(500).json({ error: err });
                doctor.reviews = results2;
            });

            const sqlDoctorSpecializations = `SELECT specializations.* FROM specializations JOIN x_doctor_specialization ON specializations.id = x_doctor_specialization.id_specialization  WHERE x_doctor_specialization.id_doctor = ?;`

            connection_db.query(sqlDoctorSpecializations, [id], (err, results3) => {
                if (err) return res.status(500).json({ error: err });
                doctor.specializations = results3;
                return res.json(doctor);
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
        if (err) { return res.status(500).json({ error: 'Internal error server' }) }
        if (!results[0]) return res.status(404).json({ error: "Doctor not found" });

        if (results[0]) {
            const sqlSpecializationDoctors = `SELECT doctors.*,  
    GROUP_CONCAT(DISTINCT specializations.name ORDER BY specializations.name SEPARATOR ', ') AS specializations,
    AVG(reviews.vote) AS vote_average 
    FROM doctors
    LEFT JOIN reviews ON doctors.id = reviews.id_doctor
    LEFT JOIN x_doctor_specialization ON doctors.id = x_doctor_specialization.id_doctor
    LEFT JOIN specializations ON specializations.id = x_doctor_specialization.id_specialization
WHERE id_specialization = ?
GROUP BY doctors.id`;
            const specialization = results[0];

            connection_db.query(sqlSpecializationDoctors, [id], (err, results2) => {
                if (err) return res.status(500).json({ error: err });
                specialization.doctors = results2;
                return res.json(specialization);
            });
        };
    });
};

function storeDoctor(req, res) {
    console.log("📩 Richiesta ricevuta per registrare un dottore:", req.body);

    const { name, surname, email, phone, office_address, serial_number, sex, img_url, specializations } = req.body;

    if (!name || !surname || !email || !phone || !office_address || !serial_number || !sex) {
        console.log("❌ Errore: uno o più campi sono mancanti");
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (name.trim().length < 3) {
        console.log("❌ Errore: Nome troppo corto");
        return res.json({ error: 'The name must contain at least 3 characters' });
    }
    if (surname.trim().length < 3) {
        console.log("❌ Errore: Cognome troppo corto");
        return res.json({ error: 'The surname must contain at least 3 characters' });
    }
    if (!email.includes('@') || !email.includes('.')) {
        console.log("❌ Errore: Email non valida");
        return res.json({ error: 'The email must contain at least one "@" and a "."' });
    }
    if (phone.trim().length < 10 || phone.trim().length > 15) {
        console.log("❌ Errore: Numero di telefono non valido");
        return res.json({ error: 'A telephone number is made up of numbers between 10 and 15' });
    }
    if (isNaN(phone)) {
        console.log("❌ Errore: Il telefono contiene caratteri non numerici");
        return res.json({ error: 'The telephone number can only consist of numbers' });
    }
    if (serial_number.trim().length !== 8) {
        console.log("❌ Errore: Serial number errato");
        return res.json({ error: 'The serial number must be 8 characters' });
    }

    const sqlAddDoctor = `INSERT INTO doctors (name, surname, email, phone, office_address, serial_number, sex, img_url) VALUES (?,?,?,?,?,?,?,?)`;
    console.log("🛠 Query SQL:", sqlAddDoctor);

    connection_db.query(sqlAddDoctor, [name, surname, email, phone, office_address, serial_number, sex, img_url], (err, results) => {
        if (err) {
            console.log("❌ Errore MySQL:", err);
            return res.status(500).json({ error: err });
        }

        console.log("✅ Risultato della query:", results);

        if (results.affectedRows === 0) {
            console.log("❌ Nessuna riga aggiunta");
            return res.status(404).json({ error: "Cannot add doctor" });
        }

        const doctorId = results.insertId;

        if (specializations && specializations.length > 0) {
            const sqlAddSpecializations = `INSERT INTO x_doctor_specialization (id_doctor, id_specialization) VALUES ?`;
            const values = specializations.map(specId => [doctorId, specId]);

            connection_db.query(sqlAddSpecializations, [values], (err, results) => {
                if (err) {
                    console.log("❌ Errore MySQL:", err);
                    return res.status(500).json({ error: err });
                }

                console.log("✅ Specializzazioni aggiunte con successo!");
                return res.status(200).json({ success: "Doctor and specializations added with success" });
            });
        } else {
            console.log("🎉 Dottore aggiunto con successo!");
            return res.status(200).json({ success: "Doctor added with success" });
        }
    });
}

function storeReview(req, res) {
    console.log("📩 Richiesta ricevuta! Body:", req.body);
    console.log("🆔 ID del dottore:", req.params.id);

    const id = parseInt(req.params.id)
    let { name_patient, vote, description, creation_date } = req.body;

    name_patient = name_patient && name_patient.trim() ? name_patient : "Anonymous"
    if (name_patient.length < 3)
        return res.status(400).json({ error: 'The length name must be min. 3 characters' });

    if (!vote || isNaN(vote) || vote < 1 || vote > 10) {
        return res.status(400).json({ error: 'The vote must be a number between 1 to 10' });
    }

    description = description && description.trim() ? description : " * No description *"
    if (description.length > 5000)
        return res.status(400).json({ error: 'The text must have max 5000 characters' });

    const sqlAddReview = ` INSERT INTO reviews (name_patient, vote, description, id_doctor, creation_date)
            VALUES (?,?,?,?,?) `

    connection_db.query(sqlAddReview, [name_patient, vote, description, id, creation_date], (err, results) => {
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
