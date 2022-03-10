#!/usr/bin/env node

import fs from 'fs-extra'

import ejs from 'ejs';

import path from 'path';

import {getAPIData, getVai, api} from '../components/invoker.js';


import {fileURLToPath} from 'url';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const argv = require('yargs-parser')(process.argv.slice(2));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const main = () => {


const initialJSON = `
{ 
  "govcenter_uri": "HERE IS THE URI FOR YOU BACKEND THAT WE WILL GET THE API'S INFORMATION",
  "api_key": "API_KEY USED TO ACCESS THE API",
  "doc_path": "WHERE IS THE DOC FOLDER INTO YOU DOCUSSAURUS PROJECT",
  "docproject": "WHERE IS DOCUSSAURUS ROOT"
}
`;

var logo = `
========================================

🦈 SharkDoc - nasph sub-project

========================================
`;

var empty = `

`;
  // 1. Welcome log
  console.log(empty);
  console.log(logo);
  
  try {
    // 2. Destructure args from argv and set _ array to variable "data"
    //const { _: leftovers, out, fn } = argv;

    const {apiname,out } = argv;

    // 3. Add the args we want to use in the .ejs template
    // to an object


    // 4. Create an empty options object to pass to the
    // ejs.renderFile function (we are keeping defaults)
    const options = {};

    // 5. Check that the required flags are in
    if (!apiname || !out ) {
      
      console.error('--apiname and --out is required for generate the MD doc');
      console.log(empty);
      process.exit(1);
    }
    // 5.1  Check that the required flags are in
    
    if (!fs.existsSync('./sharkdoc.json') ) {
      console.error(` As you haven't created a sharkdoc.json file in the root level from this project, we had created one for you. `);
      
      fs.writeFileSync('./sharkdoc.json', initialJSON);

      console.log(empty);
      process.exit(1);
    }    

    const config = require("../sharkdoc.json");

    // 6. Set our ejs template file, nominating it to read the
    // sibling "main.ejs" file sibling in the same directory
    const filename = path.join(__dirname, './templates/md-page.ejs');


    const apiInfo = api.get();

    apiInfo.then((res)=>{
      console.log("API Context Loaded for: " + res.data.data.attributes.name);

      const data = {
        apiname, out, config, res
      };

      ejs.renderFile(filename, data, options, function (err, str) {
        // str => Rendered HTML string
        if (err) {
          console.error(err);
        }
  
        const outputFile = path.join(process.cwd(), out);
        fs.ensureFileSync(outputFile);
        fs.outputFileSync(outputFile, str);
        console.log(empty);
        console.log('... Generated file: ' + out + ', created with sucessful ');
        console.log(empty);
      });

    
    });
    


  } catch (err) {
    console.error(err);
  }

  
};

main();
