## Synopsis

This is a small project for the administration of the person to job assignments of one or more organizations.
They can each have a management and also distinct jobs, which can be defined dynamically in the database. Additionally it's possible to define common jobs, which can be done by anybody of the organizations.
Jobs can be assigned to many persons, each editable in place.
The whole application is build for maximum comfortability of the user and permanent data integrity.
Therefore e.g. it's not possible to assign a job to a person, which does not exist or is misspelled.

## Installation

1. Get the latest node version
2. Get the latest npm version

   You maybe want to use a version manager like 'n' or 'nvm' for that.

3. Get the latest mongodb version
4. Install some packages with npm globally:
  1. `npm install -g bower gulp node-gyp`
5. Run `npm install`
  1. In case of a contextify-error, you maybe need to install g++-multilib on your system
6. Run `bower install`
7. Setup configuration file:
  1. `cp config.tmpl.js config.js`
  2. Edit config.js to fit your needs
8. Setup stylesheet file:
  1. `cp app/styles/organizations.tmpl.scss app/styles/organizations.scss`
  2. Edit it to fit your needs
9. Run `gulp`
10. Run `gulp serve`
11. Open a browser and open your url
