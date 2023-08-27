const express = require('express')

const app = express()

app.get('/', (request, response) => {
     response.send("Instructions")
})

app.listen(3000, () => {
    console.log(`Server is Listening on 3000`)
})