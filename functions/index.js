// const functions = require("firebase-functions");
// const express = require("express");
// const cors = require("cors");
const documentParser = require("./legaldocumentparser");
// const multer = require("multer");
// const bodyParser = require("body-parser");
// const app = express();
const fs = require('fs');

const Blob = require("cross-blob");
// app.use(cors());
// app.use(bodyParser({ limit: "50mb" }));

let data = {
    G1: [
        {
            Q1: "Ай ло",
            Q2: "2020.09.22",
            Q3: "4",
            Q4: "Иргэн",
            Q5: "AA",
        },
    ],
    G2: [
        {
            Q6: "Улаанбаатар хот",
            Q7: "Баянзүрх дүүрэг",
            Q8: "19-р хороо",
            Q9: "1-р хороолол",
            Q10: "25-р байр",
            Q11: "102 тоот",
            Q12: "954121312",
        },
    ],
    G3: [
        {
            Q12: "70075858",
        },
        {
            Q12: "70006565",
        },
    ],
    G7: [
        {
            Q17: "ЭА8888888",
            Q18: "ДL98071516",
            Q19: "Гэрийн хаяг",
            Q20: "99999999,21321",
            Q21: "211321213",
        },
        {
            Q17: "ЭА8888888",
            Q18: "ДL98071516",
            Q19: "Гэрийн хаяг",
            Q20: "99999999,21321",
            Q21: "211321213",
        },
    ],
    G8: [],
    G9: [
        {
            Q26: "Нийгмийн сайн сайхны төлөө",
        },
    ],
    G10: [
        {
            Q27: "aaaa",
        },
        {
            Q27: "aaaa",
        },
    ],
    G11: [
        {
            Q28: "dasda",
            Q29: "dsada..",
            Q30: "DSADSADA",
        },
    ],
    G12: [
        {
            Q31: "25",
        },
    ],
    G14: [
        {
            Q33: "ADSAD",
            Q34: "DSADA",
            Q35: "DDDDASDA",
        },
        {
            Q33: "ADSAD",
            Q34: "DSADA",
            Q35: "DDDDASDA",
        },
        {
            Q33: "ADSAD",
            Q34: "DSADA",
            Q35: "DDDDASDA",
        },
    ],
    G15: [
        {
            Q38: "dsad",
            Q36: "dsadas",
            Q37: "dasd",
        },
    ],
};
fs.readFile('/home/dddqwerty/dev/ilaw/15.1.1.1 (1).docx',{}, (a,b) => {
    documentParser.parser(b,data,'dada').then(a => {
   
        fs.writeFileSync("My Document.docx", a);
    });
})

// app.post("/upload", (req, res) => {
//     const zip = req.body;
//     console.log(JSON.stringify(zip));
//     // documentParser.parser(zip, {}, "dada");
//     res.send(zip);

//     // console.log(base64.data )
// });

// exports.api = functions.region("asia-east2").https.onRequest(app);
