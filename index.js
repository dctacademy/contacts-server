const express = require('express')
const cors = require('cors')
const fs = require('fs')
const app = express() 
const PORT = process.env.PORT || 3045
app.use(express.json())
app.use(cors())

app.get('/api/contacts', (req, res) => {
    fs.readFile('./data.json', 'utf-8', (err, db) => {
        if (err) {
            res.json(err)
        } else {
            const data = JSON.parse(db)
            const { search, sort} = req.query 
            if(search) {
                const result = data.filter(ele => Object.values(ele).toString().toLowerCase().includes(search)) 
                if(result.length > 0) {
                    res.json({
                        total: result.length,
                        data: result
                    }) 
                } else {
                    res.status(404).json(result)
                }
            } else if(sort) {
                if(sort == 'a-z') {
                    const result = data.sort((contact1, contact2) => {
                        const name1 = `${contact1.firstName}`;
                        const name2 = `${contact2.firstName}`;
                        return name1.localeCompare(name2);
                    })
                    res.json({
                        total: result.length,
                        data: result
                    })
                } else if(sort == 'z-a') {
                    const result = data.sort((contact1, contact2) => {
                        const name1 = `${contact1.firstName}`;
                        const name2 = `${contact2.firstName}`;
                        return name2.localeCompare(name1);
                    })
                    res.json({
                        total: result.length,
                        data: result
                    })
                }
                
            } else {
                res.json({
                    total: data.length, 
                    data: data
                })
            }
        }
    })
})


app.get('/api/results/:usn', (req, res) => {
    const usn = req.params.usn
    fs.readFile('./data.json', 'utf-8', (err, db) => {
        if (err) {
            res.json(err)
        } else {
            const data = JSON.parse(db)
            const result = data.find(result => result.usn == usn)
            if (result) {
                res.json(result)
            } else {
                res.json({})
            }
        }
    })
})

app.listen(PORT, () => {
    console.log('server running on port ' + PORT)
})