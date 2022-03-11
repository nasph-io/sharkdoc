#!/usr/bin/env node

import fs from 'fs-extra'
import ejs from 'ejs';
import axios from 'axios';

import inquirer from "inquirer";
import  figlet from "figlet";
import shell from "shelljs";
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
===============================================
    
    🦈 SharkDoc - API Dev & Doc Portal 
    
===============================================
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

      //check if local json with properties existies
      if (!fs.existsSync('./sharkdoc.json') ) {
        console.error(` As you haven't created a sharkdoc.json file in the root level from this project, we had created one for you. `);
        
        fs.writeFileSync('./sharkdoc.json', constants.INITIAL_JSON);
  
        console.log(empty);
        process.exit(1);
      }  
      //end if check if json is in there

      const config = require("./sharkdoc.json");

      //Set our ejs template file, nominating it to read the
      // sibling "main.ejs" file sibling in the same directory
      const filename = path.join(__dirname, './templates/md-page.ejs');


 
      const apiInfo = axios.get(config.govcenter_uri_apis, {
        headers: {
          'Authorization': `Bearer ${config.api_key}`
        }
      })
      .then((res) => {

       var response = jp.query(res.data, '$.data.*');

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
            console.error(err);
          }
    
          const outputFile = path.join(process.cwd(), out+'.md');
          fs.ensureFileSync(outputFile);
          fs.outputFileSync(outputFile, str);
          console.log(constants.SPACER_STRING);
          

          console.log(chalk.green(emoji.get('coffee')  + ': Generated file: ' + out + '.md, created with sucessful '));
          console.log(constants.SPACER_STRING);
        });
  
      })
      .catch((error) => {
        console.error(error)
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