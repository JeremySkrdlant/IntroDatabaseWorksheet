const express = require('express')
//This library lets us read in data from files on the system. I use it to create the tables and create the ticket sales.
const fs = require('fs');
//This library lets us connec to mysql 
var mysql = require('mysql');
//This library allows us to read private variables from a seperate file that is not pushed to the repository. 
require('dotenv').config()

const app = express()

//These are your tasks that you need to complete for this assignment.
app.get('/', (request, response) => {
     response.send(["Do an NPM Install", 
                "Create a blank database on your machine, Set up a user that has access",
                "Set up your .env file and run the testDotEnvData route to make sure everything is good", 
                "Fill out the createTable route so that it adds the data that it is currently showing.", 
                "Fill out the insertData route so that this it inserting the data", 
                "Fill out the selectUserAtSeat route so that the user can pass in a seat number and get a first and last name back.",
                "Fill out the ticketsSold route which uses the SQL Count functioin.",
                "Fill out the ticketRefund route which will delete a user based on seat number."
            ])
})

app.get('/testDotEnvData', (request, response) => {
     //You will create a .env file and put in the following variables in it.  Fill them in with the data you set up in your MySQL instance.  
     // HOST=""
     // DBUSER=""
     // PASSWORD=""
     // DATABASE=""

     //Then run this route to see if you are connected. 
     
     //This query works with mysql, it will show all the table in a database.  Ours will be empty like [] if we are succesful with our .env file.
     let sql = 'show tables'

     //This is how we will run our sql for the rest of the routes. 
     //It returns a promise that can succeed or fail.  
     //The code for this function is at the bottom of the file. 
     runQuery(sql)
     .then((result)=>{
        response.send({status:'Success - your dot env file is correct', result:result});
     })
     .catch((error)=>{
        response.send({status:'error with your dot env', error:error});
     })
})

app.get('/createTable', (request, response) => {

    //We read in our tableCreate file and specify it is text with the utf8.  
    //Once the file is read, our callback with an error or data is called 
    fs.readFile('./Data/tableCreate.txt', 'utf8', (err, data)=>{
        //We got an error reading the file. This shouldn't happen.  If you get this error, 
        //troubleshoot your error and get the instructor if it continues not to work. 
        if (err) {
            response.send("There is an error reading the file.")
        }
        //We get the data as one big string.  We want to split on each newline for each row of data.
        let rowData = data.split("\n");
        //The top row of data is our table name
        let title = rowData[0];
        //We will fill out our property names in the loop.
        let properties = [];
        for(let i = 1; i < rowData.length; i++){
            //we start at 1 instead of 0, our title was at 0. We then split on : to get a left side and right side of our data.
            let splitRow = rowData[i].split(":");
            //we push to the array a dictionary with column and type keys.
            properties.push({column: splitRow[0], type:splitRow[1]});
        }

        //Step 1 - Create the SQL to create a table from the data shown in the response.  If you need help, there is a website link you can visit to see the structure of creating a table in SQL

        //Step 2 - Send that SQL to the database with the runQuery function. An example can be found in the   
        response.send({tableTitle: title, columns: properties, sqlHelp:'https://www.w3schools.com/sql/sql_create_table.asp'})
    }) 
})

app.get('/insertData', (request, response) => {
    //similar reading but a different file. 
    fs.readFile('./Data/ticketSales.txt', 'utf8', (err, data)=>{
        if (err) {
            response.send("There is an error reading the file.")
        }
        let rowData = data.split("\n");
        let seats = []
        for(let i = 0; i < rowData.length; i++){
            //we start at 0 this time because every row is data. 
            let splitSeat = rowData[i].split(" ");
            seats.push({firstName: splitSeat[0], lastName: splitSeat[1], seatNumber: splitSeat[2]})
        }
        //Step 1 - Create a multiple insert from the data in seats.  

        //Step 2 - Send the data to the database with the sqlHelp function.
        response.send({data:seats, sqlHelp:'https://www.w3schools.com/sql/sql_insert.asp' });
    });

})

app.get('/selectUserAtSeat/:seatNumber', (request, response) => {
    // Step 1 - get the seatNumber from the parameters

    // Step 2 - Create a Select Query based on who is at that seat number. 

    // Step 3 - run the query 

    // Step 4 - Comment out the normal response and send back your query response. 

    response.send({task:'Get firstname and lastname based off of seat number', sqlHelp:'https://www.w3schools.com/sql/sql_select.asp'});
     
})

app.get('/ticketsSold', (request, response) => {
     // Step 1 - Create a select statement that counts how many seats are sold

     // Step 2 - Run the Query 

     // Step 3 - Comment out the normal response and send back your query response.

     response.send({task: 'Get the total count of seats that have been sold.', sqlHelp: 'https://www.w3schools.com/sql/sql_count_avg_sum.asp'});
})

app.get('/ticketRefund/:seatNumber', (request, response) => {
     // Step 1 - Get the seatNumber from the parameters 

     // Step 2 - Create a Delete query which deletes out only the one seat. 

     // Step 3 - Run the Query 

     // Step 4 - Comment out the normal response and send back your query response.

     response.send({task: 'Delete out one ticket that has that seat number', sqlHelp: 'https://www.w3schools.com/sql/sql_delete.asp'});
})

//all our routes are done, our server is listening to port 3000
app.listen(3000, () => {
    console.log(`Server is Listening on 3000`)
})

//This function takes a query string.  If successful, it will return a promise to the .then section. 
//If there is an error in your query or database connectioin, it will reject to the .catch section. 
function runQuery(query){
    return new Promise((resolve, reject) => {
        //Our connection should have all our secret information secret. That is why we are using a .env file for this.  The gitignore will ignore this file therefor our secrets will remain on our computer instead of on a public repository.
        var con = mysql.createConnection({
            host: process.env.HOST, 
            user: process.env.DBUSER, 
            password: process.env.PASSWORD, 
            database: process.env.DATABASE
        });

        //We try to connect, if the connection fails we get an error and return a promise rejection.
        con.connect((error)=>{
            if(error){
                reject(error)
            }
            //We run a query, either we can get results back or we can get an error. 
            con.query(query, (error, result)=>{
                if (error){
                    reject(error)
                }
                //No error, resolve the promise with the results. 
                resolve(result);
            })
        })
    })
}