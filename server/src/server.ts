import express from 'express';

const app = express();

app.get('/users', (request, response)=> {
    console.log("Listando exemplos");

    response.json({"NameApp": "OfficinasHelpers", "Function": "Help peoples to find a Mecanic Car when they needed"});
});

app.listen(3333);