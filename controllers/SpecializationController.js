import connection_db from '../connection.js'


// INDEX FUNCTION TO SHOW ALL DOCTORS
function index(req, res) {

    // CREAZIONE DELLA QUERY SQL PER MOSTRARE LA LISTA DEI DOTTORI E LE SUE RECENSIONI CORRELATE
    const sql = `SELECT * FROM specializations`

    connection_db.query(sql, (err, results) => {

        // GESTIONE ERRORI
        if (err) { return res.status(500).json({ error: 'Internal error server' }) }
        if (results.length === 0) { return res.status(200).json({ message: 'No doctors Available' }) }

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

export { index }
