// server.js 
// express is used to create the API
const express = require('express');

const { body, validationResult } = require('express-validator');

const { BigQuery } = require('@google-cloud/bigquery');


require('dotenv').config();

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
const database = process.env.PLATFORM_DATABASE
const users_table = process.env.USERS_TABLE

const app = express();
const port = 3001;
const phoneRegex = /^[0-9]{10}$/; // Matches a 10-digit number

// bigquery client using env variables
const bigquery = new BigQuery({
    projectId: credentials.project_id,
    credentials: credentials
  });

app.use(express.json());

app.get('/getuser/:email/:pwd', async (req, res) => {
  try {
    const email = req.params.email
    const password = req.params.pwd
    const query = `SELECT * FROM ${database}.${users_table} WHERE (email= @mail ) AND (password= @pwd )`;

    const options = {
      query: query,
      params: { mail: email,
                pwd: password
            },

      // Location must match that of the dataset(s) referenced in the query. EU in our case
      location: 'EU',
    };

    // Run the query
    const [rows] = await bigquery.query(options);

    if (rows.length > 0){
        rows[0]['response'] = "FOUND";
        res.status(200).json(rows);
    }
    else{
        res.status(200).json(
            {
                "response":"NOT FOUND"
        })
    }
        
  } 

  catch (error) {
    console.error('Error running query:', error);
    res.status(500).json({ error: 'An error occurred while querying data.' });
  }
});

app.post('/createuser/',
    body('name').isString().notEmpty(),
    body('surname').isString().notEmpty(),
    body('email').isString().notEmpty(),
    body('password').isString().notEmpty(),
    body('user_type').isString().notEmpty(),
    body('phone_number').isString().notEmpty().matches(phoneRegex),
    async (req, res) => {

    try 
    {
    const user_info = req.body;
    const query = `INSERT INTO ${database}.${users_table}(email, password, user_type, name, surname, phone_number) VALUES(@mail, @pwd, @user_type, @name, @surname, @phone_number)`;
    const options = {
        query: query,
        params:{
            mail: user_info.email,
            pwd: user_info.password,
            user_type: user_info.user_type,
            name: user_info.name,
            surname: user_info.surname,
            phone_number: user_info.phone_number,
        },
        location: 'EU',
    }

    // Query the table to count the rows inserted
    let countQuery = `SELECT COUNT(*) as numRowsInserted FROM ${database}.${users_table} WHERE email=@mail`;
    let option = {
        query: countQuery,
        params:{
            mail: user_info.email,
        },
        location: 'EU',
    }
    let [rows] = await bigquery.query(option);
    const numRows = rows[0].numRowsInserted;

    if(numRows > 0){

        res.status(200).json({ success: false, message: 'User already exists', user_status: 'created'});
    }
    else{
        await bigquery.query(options);
        res.status(200).json({ success: true, message: 'User added', user_status: 'created' });
    }
    
    }
    catch(error){
        console.error('Error running query:', error);
        res.status(500).json({ error: 'An error occurred while querying data.' });
    }
}

)

app.post('/deleteuser/', 
  body('email').isString().notEmpty(),
  async (req, res) => {
    try{
      const user_info = req.body;

      async function get_number_rows_by_email(email, database, users_table){
        let query_1 = `SELECT * FROM ${database}.${users_table} WHERE (email= @mail )`;

        let options_1 = {
          query: query_1,
          params: { mail: email
                },
          // Location must match that of the dataset(s) referenced in the query. EU in our case
          location: 'EU',
        };
        const [rows] = await bigquery.query(options_1);
        const result = rows.length
        return result
      }

      const n_rows_before = await get_number_rows_by_email(user_info.email, database, users_table)

      let query = `DELETE FROM ${database}.${users_table} WHERE (email = @mail)`;
      let options = {
          query: query,
          params:{
              mail: user_info.email,
          },
          location: 'EU',
      }
      const [job] = await bigquery.query(options)

      const n_rows_deleted = n_rows_before - await get_number_rows_by_email(user_info.email, database, users_table)

      res.status(200).json({ success: true, numRowsDeleted: n_rows_deleted });

    }
    catch(error){
      console.error('Error running query:', error);
      res.status(500).json({ error: 'An error occurred while querying data.' });
    }

  }

)

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app; // Export the Express app instance