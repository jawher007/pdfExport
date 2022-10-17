var express = require('express'); 
var pdf2base64 = require('pdf-to-base64');
var router = express.Router();
var bodyParser = require('body-parser');
var generateHtml = require('../PdfCreation/createTable.js');
var generatePdf = require('../PdfCreation/createPdf.js');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Create Devis PDF
router.post('/exportDevisPdf', async function  (req, res) {
    await generateHtml(req);
    await generatePdf();
    await pdf2base64("build.pdf")
		.then(
			(response) => {
                res.status(200).send({extension:".pdf",data:response});
			}
		)
		.catch(
			(error) => {
				console.log(error); //Exepection error....
			}
		)
    }) ;



module.exports = router;