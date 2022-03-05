#!/usr/bin/env node

import fs from 'fs-extra'
import ejs from 'ejs';


import inquirer from "inquirer";
import chalk from "chalk";
import  figlet from "figlet";
import shell from "shelljs";
import clear from "clear";
import path from 'path';
import * as constants  from './components/constants.js';

import {fileURLToPath} from 'url';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chalkAnimation = require('chalk-animation');

import {getAPIData, getVai, api} from './components/invoker.js';



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
              font: "ogre",
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
        message: 'Now, it is time to inform the markdown (md) filename (eg: MySweetApi.md) '
      },
    ])
    .then(answers => {
      console.info('Answers:', answers);

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
          console.log(constants.SPACER_STRING);
          console.log('... Generated file: ' + out + ', created with sucessful ');
          console.log(constants.SPACER_STRING);
        });
  
      
      });




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

   // textAnimatedly("Action selected:  " + command);


    var action = command;

    if (action == constants.CREATE_PAGE_ACTION) {

        const rainbow = chalkAnimation.rainbow("SharkDoc in Action....");
        setTimeout(() => {
            createMdPage();
        }, 500);

        

    }    

} catch (err) {
    console.error(err);
  }

}

run();