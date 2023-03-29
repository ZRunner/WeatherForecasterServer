import mysql from 'mysql';

export const createConnection = () => 
  mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  })


export const saveForecast = (conn: mysql.Connection,predictions: Predictions) => {
  const query = 'INSERT INTO `forecast` VALUES ? ON DUPLICATE KEY UPDATE precipitations = VALUES(precipitations)';
  const data = Object.entries(predictions);

  conn.query(query, [data], (err) => {
    if (err) console.error("Error while saving predictions to DB:", err);
    conn.end();
  });
}