import mysql from 'mysql';

export function connectToUser(username, password) {
  
    // Connection to database
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "0000",
        database: "staracademy"
    });

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