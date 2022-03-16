#!/usr/bin/env node

import fs from 'fs-extra'
import ejs from 'ejs';
import axios from 'axios';

import inquirer from "inquirer";
import  figlet from "figlet";
import clear from "clear";
import path from 'path';
import * as constants  from './components/constants.js';

import {fileURLToPath} from 'url';

import { createRequire } from "module";
import chalk from 'chalk';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chalkAnimation = require('chalk-animation');
var jp = require('jsonpath');
var emoji = require('node-emoji')


const init = () => {
    var logo = `
=====================================================    
    🦈 SharkDoc - API Dev & Doc Portal   v.0.0.14  
=====================================================
    `;    

  clear();
  console.log(
      chalk.magenta(
          figlet.textSync("sharkdoc", {
              font: "Ogre",
              horizontalLayout: "default",
              verticalLayout: "default"
          })
      ),
      chalk.magenta(
        logo
    )
  );
  
};

function  textAnimatedly(text)  {

    const rainbow = chalkAnimation.rainbow(text);
    setTimeout(() => {
        // Stop the 'Lorem ipsum' animation, then write on a new line.
        console.log('dolor sit amet');
    }, 1000);

}

const askQuestions = () => {
    const questions = [{
        type: "list",
        name: "command",
        message: "Please, select what would you like to do? ",
        choices: [constants.CREATE_PAGE_ACTION, constants.ADAPT_DOCUSSAURUS],
    }];
    return inquirer.prompt(questions);
};

const createMdPage = async()=> {

    inquirer
    .prompt([
      {
        name: 'apiname',
        message: 'Hey buddy, tell us the API Name from the Backend (Gov Center)?'
      },
      {
        name: 'out',
        message: 'Now, it is time to inform a name for markdown file (no need to end with .md) '
      },
    ])
    .then(answers => {
      
      const apiname = answers.apiname;
      const out  = answers.out;



      const options = {};

      var currentPath = process.cwd();

     

      //check if local json with properties existies
      if (!fs.existsSync(currentPath + '/sharkdoc.json') ) {

        console.error(` As you haven't created a sharkdoc.json file in the root level from this project, we had created one for you. `);
        console.error(` Creating the json configs in:  ` + currentPath + '/sharkdoc.json');
        
        fs.writeFileSync(currentPath + '/sharkdoc.json', constants.INITIAL_JSON);
        process.exit(1);
      }  
      //end if check if json is in there



      console.log(chalk.magenta("Loading Config JSON from: "+   currentPath +"/sharkdoc.json"));

      const config = require(currentPath +"/sharkdoc.json");

      //Set our ejs template file, nominating it to read the
      // sibling "main.ejs" file sibling in the same directory
      const filename = path.join(__dirname, './templates/md-page.ejs');

      const api_endpoint_uri = config.govcenter_base_uri+ `/api/apis?api_key=${apiname}&populate=*`;

      console.log(chalk.magenta("Invoking Govcenter Endpoint from: "+   api_endpoint_uri));
 
      const apiInfo = axios.get(api_endpoint_uri, {
        headers: {
          'Authorization': `Bearer ${config.api_key}`
        }
      })
      .then((res) => {

       var response = jp.query(res.data, '$.data.*');
       //jsonpath for extract just what matters for building the page

       const payloadString = JSON.stringify(response);

       const payloadIntermediate = payloadString.slice(1,-1);

       const payload = JSON.parse(payloadIntermediate);

       console.log(constants.SPACER_STRING);

       console.log(chalk.magenta("API Context Loaded for: "+    payload.attributes.api_key_name));

       // adding just the plans in the context ....

       const plansPayload = JSON.parse(JSON.stringify(payload.attributes.plans));
       

        // adding the variables to be used in the template file for generating the markdown page
        const data = {
          apiname, out, config, payload, plansPayload
        };
  
        ejs.renderFile(filename, data, options, function (err, str) {
          // str => Rendered HTML string
          if (err) {
            

            console.error(chalk.magenta("Error parsing the informed template: "+  err));
           
          }

          //const mdFileName = currentPath + config.doc_path +  out;

          const mdFileName = config.doc_path +  out;
    
          const outputFile = path.join(process.cwd(), mdFileName+'.md');
          fs.ensureFileSync(outputFile);
          fs.outputFileSync(outputFile, str);

          console.log(constants.SPACER_STRING);
          

          console.log(chalk.green(emoji.get('coffee')  + ': Generated file: ' + out + '.md, created with sucessful '));
          console.log(constants.SPACER_STRING);
        });
  
      })
      .catch((error) => {

        console.log(chalk.magenta("Something didn't worked as expect, try again or check out the error log \r\n\t "+    error)); 
        //console.error(error)
      })


    });

};


const run = async() => {

    try {    

    // show script introduction
    init();

    // ask questions the baby
    const answers = await askQuestions();
    // check what is coming by 
    const { command } = answers;

    var action = command;

    if (action == constants.CREATE_PAGE_ACTION) {

        //create the markdown page


        const rainbow = chalkAnimation.rainbow(" ======= 🦈  SharkDoc in Action =======  " );
        setTimeout(() => {

            rainbow.stop();

            createMdPage();
       
       
        }, 1000);

        

    }    

} catch (err) {
    console.error(err);
  }

}

run();