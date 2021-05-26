const express = require('express');
const app = express();
const cors = require('cors');

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//Static directories
app.use('/static',express.static(__dirname +'/static'));

//Render html
app.get('/', (req, res) => {
    res.sendFile('views/index.html', {root: __dirname })
});

//JSONs
app.get('/sintomas', (req, res) => {
    res.sendFile('db/sintomas.json', {root: __dirname })
});
app.get('/enfermedades', (req, res) => {
    res.sendFile('db/enfermedades.json', {root: __dirname })
});

//Results
app.post('/genfakeresults', (req, res) => {
    const {answers, diseases} = req.body.data;
    console.log(answers, diseases);
    res.status(200).json({
        results: [0.54, -1, 5, 0.2, 0.88, 0.99, 3.2, -1, -1 ,-1]
    });
});

app.post('/genresults', (req, res) => {
    const {answers, diseases} = req.body.data;

    const processedSymptoms = answers.map(answer => parseFloat(answer.answer));
    const processedDiseases = diseases.map(disease => parseFloat(disease.answer));

    const sendArray = `[[${processedSymptoms}],[${processedDiseases}]]`;

    console.log(sendArray);

    //Process symptoms
    console.log("\n\nProcesando sintomas...");
    var spawn = require("child_process").spawn;
    var process = spawn('py', ["./code/main1.py", sendArray ]);
    console.log("Calculando...");

    process.stdout.on('data', function (data) {
        console.log("Calculado, enviando respuesta...");
        
        console.log("Respuesta enviada, mostrando resultados:");
        console.log(data.toString());

        res.status(200).json({
            results: JSON.parse(data.toString())
        });
    });

    
});


function sistemasDeEcuaciones(req, res) {
    
    // using spawn instead of exec, prefer a stream over a buffer
    // to avoid maxBuffer issue
    
    
  }


//Start server
app.listen(3000, () => {
    console.log("Server started Bv...");
});