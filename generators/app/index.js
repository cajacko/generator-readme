/* @flow */

const Generator = require('yeoman-generator');
const path = require('path');
const checkOutOfDatePackages = require('check-out-of-date-packages');

module.exports = class extends Generator {
  initializing() {
    const cwd = path.join(__dirname, '../../');
    return checkOutOfDatePackages(cwd, 'Charlie Jackson');
  }

  writing() {
    let readme = '';
    const destPath = this.destinationPath('./README.md');

    if (this.options && this.options.tag && this.options.markdown) {
      const start = `<!--- generator-readme-start ${this.options.tag} -->`;
      const end = `<!--- generator-readme-end ${this.options.tag} -->`;
      const partial = `${start}\n${this.options.markdown}\n${end}`;

      if (this.fs.exists(destPath)) {
        const file = this.fs.read(destPath);
        const replace = `^${start}[\\s\\S]*^${end}`;
        const re = new RegExp(replace, 'm');

        readme = file.replace(re, partial);
      } else {
        readme = partial;
      }

      return this.fs.write(destPath, readme);
    }

    return this.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Readme Title: ',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Readme Description: ',
      }
    ]).then((answers) => {
      readme = `# ${answers.title}\n\n${answers.description}`;
      return this.fs.write(destPath, readme);
    });
  }
};
