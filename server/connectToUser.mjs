import mysql from "mysql2/promise";

// Pool global réutilisé
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "0000",
  database: process.env.DB_NAME || "staracademy",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function connectToUser(username, password) {

    con.connect(function(err) {
        if (err) throw err;
    });

    con.query("SELECT * FROM utilisateur WHERE nomUtilisateur='" + username + "' AND motDePasse='" + password + "';", function (err, result, fields) {
        if (typeof result[0] == "undefined"){
            console.log("SELECT * FROM utilisateur WHERE nomUtilisateur='" + username + "' AND motDePasse=' " + password + "';");
            return false;
        } 
        else{
            console.log("Logged in");
            return true;
        }
        
    });
}