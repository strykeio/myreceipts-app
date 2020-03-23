
/**
 * Type before create trigger.
 * - sets alias to uppercase name
 */
// create a copy of the record so that it can be modified directly. 
let newType = JSON.parse(JSON.stringify(stryke.data.recordAfter));

newType.alias = newType.name.toUpperCase().replace(/\s/g,'');

stryke.resolve(newType);
