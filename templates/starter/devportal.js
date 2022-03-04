#!/usr/bin/env node

const fs = require('fs-extra');
const ejs = require('ejs');
const argv = require('yargs-parser')(process.argv.slice(2));
const path = require('path');

const main = () => {

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
    const { apiname, out } = argv;

    // 3. Add the args we want to use in the .ejs template
    // to an object
    const data = {
      apiname, out
    };

    // 4. Create an empty options object to pass to the
    // ejs.renderFile function (we are keeping defaults)
    const options = {};

    // 5. Check that the required flags are in
    if (!apiname || !out) {
      console.error('--apiname and --out is required for generate the MD doc');
      process.exit(1);
    }

    // 6. Set our ejs template file, nominating it to read the
    // sibling "main.ejs" file sibling in the same directory
    const filename = path.join(__dirname, './md-page.ejs');

    // 7. Run the renderFile, passing the required args
    // as outlined on the package docs.
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
  } catch (err) {
    console.error(err);
  }

  
};

main();
