const { BigQuery } = require('@google-cloud/bigquery');

require('dotenv').config();

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)


// bigquery client using env variables
const bigquery = new BigQuery({
    projectId: credentials.project_id,
    credentials: credentials
  });

async function queryData() {
    const email = 'heunambiafeng@gmail.com';
    const password = 'test';
    const query = 'SELECT * FROM Platform.users WHERE (email= @param1 ) AND (password= @param2 )';
    const options = {
        query: query,
        params: { 
            param1: email,
            param2: password },
        // Location must match that of the dataset(s) referenced in the query.
        location: 'EU',
    };

    try {
    // Run the query
    const [rows] = await bigquery.query(options);
    // Print the results
    rows.forEach(row => {
      console.log(row);
    });
  } catch (error) {
    console.error('Error running query:', error);
  }
}

// Call the function to execute the query
queryData();
