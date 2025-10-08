
import {connectToUser} from './connectToUser.mjs';

import mysql from 'mysql';

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "staracademy"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

/*con.query("insert into utilisateur (nomUtilisateur, prenomUtilisateur, email, motDePasse, idRole) values ('Test', 'Testo', 'test@test.fr', 'testpwd', 2);", function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });

con.query("select * from utilisateur;", function (err, result, fields) {
    if (err) throw err;
    console.log("Result: " + result[0].nomUtilisateur);
  });
  */


  if(connectToUser("Test", "testpwd")){
    console.log("YEAY");
  }
    
  else{
    console.log("NOOO");
  }
    
