/**
 * Business before create trigger.
 * - sets alias to uppercase name with no whitespaces
 */
// create a copy of the record so that it can be modified directly. 
let newBusiness = JSON.parse(JSON.stringify(stryke.data.recordAfter));

newBusiness.alias = newBusiness.name.toUpperCase().replace(/\s/g,'');

stryke.resolve(newBusiness);
