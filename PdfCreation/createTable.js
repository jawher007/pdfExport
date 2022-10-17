const fs = require('fs');
// Build paths
const { buildPathHtml } = require('./buildPaths');


const createRow = (item) => `
<tr>
    <td>
        <div class="flex flex-col">
            <div>
                ${item.label}
            </div>
            <div class="mt-4">
                ${item.description}
            </div>
            <div class="mt-4">
                <div>${item.subcontractor.name}</div>
                <div>${item.subcontractor.address},${item.subcontractor.town},${item.subcontractor.zipcode}</div>
                <div>${item.subcontractor.phone}</div>
            </div>
    </td>
    <td>${item.quantity}</td>
    <td>${item.tva} %</td>
    <td>${item.unitHTPrice} €</td>
    <td>${item.htPrice} €</td>
    <td>${item.ttcPrice} €</td>
</tr>
`;

/**
 * @description Generates an `html` table with all the table rows
 * @param {String} rows
 * @returns {String}
 */
const createTable = (rows) => `
  <table class="mt-6 print-friendly">
    <tr>
        <th>Libellé</td>
        <th>Qté</td>
        <th>Tva</td>
        <th>Prix unitaire HT</td>
        <th>Prix HT</td>
        <th>Prix TTC</td>
    </tr>
    ${rows}
  </table>
`;

/**
 * @description Generate an `html` page with a populated table
 * @param {String} table
 * @returns {String}
 */
const createHtml = (table,devisHeader,prices,signature) => `
  <html>
    <head>
    <link href="styles/style.css" rel="stylesheet">
    <script type="text/javascript">
    window.onload = addPageNumbers;

    function addPageNumbers() {
      var totalPages = Math.ceil(document.body.scrollHeight / 1123);  //842px A4 pageheight for 72dpi, 1123px A4 pageheight for 96dpi, 
      for (var i = 1; i <= totalPages; i++) {
        var pageNumberDiv = document.createElement("div");
        var pageNumber = document.createTextNode("Page " + i + " sur " + totalPages);
        pageNumberDiv.style.position = "absolute";
        pageNumberDiv.style.top = "calc((" + i + " * (297mm - 0.5px)) - 40px)"; //297mm A4 pageheight; 0,5px unknown needed necessary correction value; additional wanted 40px margin from bottom(own element height included)
        pageNumberDiv.style.height = "16px";
        pageNumberDiv.appendChild(pageNumber);
        document.body.insertBefore(pageNumberDiv, document.getElementById("content"));
        pageNumberDiv.style.left = "calc(100% - (" + pageNumberDiv.offsetWidth + "px + 10px))";
      }
    }
  </script>
      <style>
        table {
          width: 100%;
        }
        tr {
          text-align: left;
        }
        th, td {
          padding: 15px;
        }
      </style>
    </head>
    <body>
  <div id="content" class="a4-size">
  ${devisHeader}
  ${table}
  ${prices}
  ${signature}
  </div>
    </body>
  </html>
`;


const createMain = (item) => `
<div class="flex flex-col w-full justify-between">
  <div class="flex w-full justify-between">
      <div class="w-1/4">
          <div class="image-container">
              <img class="devisImage" src='${item.company.logo}' alt='Logo de l'entreprise'>
          </div>
      </div>
      <div class="flex  justify-between w-1/2">
          <div class=" flex flex-col">
              <div class=" font-bold">Numéro du devis</div>
              <div class=" font-bold">Numéro client</div>
              <div class=" font-bold">Devis créé le</div>
              <div class=" font-bold">Devis valable jusqu’au</div>
          </div>
          <div class=" flex flex-col">
              <div class="">${item.devisNumber}</div>
              <div class="">${item.customer.customerNumber}</div>
              <div class="">${item.createdOnUtc}</div>
              <div class="">${item.devisAvailibility}</div>
          </div>
      </div>
  </div>
  <div class="item234 flex flex-col w-full mt-5 mb-5">
      <div class="item2 flex flex-col">
          <div >
              ${item.company.name}
          </div>
          <div >
              ${item.company.address}
          </div>
          <div >
              ${item.company.zipCode},${item.company.town}
          </div>
      </div>
      <div class=" flex w-full justify-between mt-3">
          <div class="flex flex-col  w-1/2">
              <div>Tél : ${item.company.telephone}</div>
              <div>E-mail : ${item.company.email}</div>
          </div>
          <div class="item flex  items-center w-1/2">${item.customer.gender} ${item.customer.fullName}</div>
      </div>
      <div class="item4 flex w-full justify-between">
          <div class=" flex items-center w-1/2">
              Siret : ${item.company.siret}
          </div>
          <div class="item  flex flex-col w-1/2">
              <div>${item.customer.address}</div>
              <div>${item.customer.zipcode},${item.customer.town}</div>
          </div>
      </div>
  </div>

  <div class=" flex w-2/5 justify-between h-12">
      <div class="flex flex-col justify-between">
          <div class="item font-bold">Réf</div>
          <div class="item font-bold">Affaire suivie par</div>
      </div>
      <div class="flex flex-col justify-between">
          <div class="item">${item.company.reference}</div>
          <div class="item">${item.company.businessSupervisor}</div>
      </div>
  </div>
</div>
`;


const createPrices = (item) => `
<div  class="total-container flex justify-end w-full  mt-6">
  <div class="flex flex-col w-1/3">
    <div class=" flex justify-between mt-1">
      <div class="">Total HT</div>
      <div class="">${item.totalHt} €
      </div>
    </div>
    <div class=" flex justify-between mt-1">
      <div class="">TVA</div>
      <div class="">${item.tva} €</div>
    </div>
    <div class=" flex justify-between mt-1">
      <div class="">Sous-total TTC</div>
      <div class="">${item.subTotalTTC} €</div>
    </div>
    <div class="flex flex-col">
      <div  class=" flex justify-between mt-1">
        <div class=" text-accent">Prime CEE</div>
        <div class=" text-accent">${item.bonusCEE} €</div>
      </div>
      <div  class=" flex justify-between mt-1">
        <div class=" text-accent">Prime MPR</div>
        <div class=" text-accent">${item.bonusMPR} €</div>
      </div>
    </div>
    <div class=" flex justify-between mt-2">
      <div class=" text-accent font-bold">Total TTC</div>
      <div class=" text-accent font-bold">${item.totalTTC} €</div>
    </div>
  </div>
</div>
`;

const createSignature = (item) => `
<div class="w-full mt-6 mb-6">
  <p class="border b-height w-full p-10">${item.signature}</p>
</div>
`;

/**
 * @description this method takes in a path as a string & returns true/false
 * as to if the specified file path exists in the system or not.
 * @param {String} filePath 
 * @returns {Boolean}
 */
const doesFileExist = (filePath) => {
	try {
		fs.statSync(filePath); // get information of the specified file path.
		return true;
	} catch (error) {
		return false;
	}
};


module.exports = tableCreation =  (req) => {
  try {
    /* Check if the file for `html` build exists in system or not */
    if (doesFileExist(buildPathHtml)) {
      console.log('Deleting old build file');
      /* If the file exists delete the file from system */
      fs.unlinkSync(buildPathHtml);
    }
    /* generate rows */
    const rows = req.body.benefits.map(createRow).join('');
    /* generate table */
    const table = createTable(rows);
  
    const header = createMain(req.body);
  
    const prices = createPrices(req.body);
  
    const signature = createSignature(req.body);
    /* generate html */
    const html = createHtml(table,header,prices,signature);
    /* write the generated html to file */
    fs.writeFileSync(buildPathHtml, html);
    console.log('Succesfully created an HTML table');
  } catch (error) {
    console.log('Error generating table', error);
  }
}

