/** 
 * When passed a JSON object will flatten the object to make it easier to use in other
 * parts of a program.
 *
 * @author Felix Estrella
 * Date: 4/17/22
 */

/** 
 * Main calling point for parsing the attributes and returning the compressed
 * json object.
 *
 * @param {object} user
 * @returns {object}
 */
function parseAttributes(user) {
    // Insert your code here.
    var compressedObj = {};
    compressedObj["Username"] = user["Username"];
    compressedObj = parseUserAttribites(user["UserAttributes"], compressedObj);
    compressedObj = parseOptionalFields(user, compressedObj);
    compressedObj = createDisplayName(compressedObj);
    return compressedObj;
}

/** 
 * Will parse the userAttributes array and add the fields to the compressedObj
 * object. Also, will ignore the "Sub" field as it is a duplicate and will turn
 * the "Custom:Tags" values into an array.
 * 
 * @param {array} userAttributes
 * @param {object} compressedObj
 * @returns {object}
 */
function parseUserAttribites(userAttributes, compressedObj) {
    for(i = 0; i < userAttributes.length; i++) {
        var obj = userAttributes[i];
        var name = titleCase(obj["Name"]);
        var value = checkTruthy(obj["Value"]);
        if (name != "Sub") {
            if (name == "Custom:tags") {
                compressedObj["Tags"] = value.split(',');
            } else {
                compressedObj[name] = value;
            }
        }
    }
    return compressedObj;
}

/** 
 * Will turn the string from snake case to title case.
 * 
 * @param {string} name
 * @returns {string}
 */
function titleCase(name) {
    var array = name.split("_");
    var str = array[0].charAt(0).toUpperCase() + array[0].slice(1);
    for(j = 1; j < array.length; j++) {
        str = str + array[j].charAt(0).toUpperCase() + array[j].slice(j);
    }
    return str;
}

/** 
 * Will check if the given value is a string of true or false. If so it will
 * set it to the corresponding truthy value. If not the string true or false
 * it will return the orginal value.
 * 
 * @param value
 * @returns can be anything
 */
function checkTruthy(value) {
    if(value == "true") {
        return true;
    } else if(value == "false") {
        return false;
    }
    return value;
}

/**
 * Will parse through the additional fields and those to the compressed object.
 * 
 * @param {object} user 
 * @param {object} compressedObj 
 * @returns {object}
 */
function parseOptionalFields(user, compressedObj) {
    var keys = Object.keys(user);

    // Ensure that Username and UserAttributes are filtered out
    keys = keys.filter(e => {
        if(!(e == "Username" || e == "UserAttributes")) {
            return e;
        }
    });

    for (i = 0; i < keys.length; i++) {
        compressedObj[keys[i]] = checkTruthy(user[keys[i]]);
    }

    return compressedObj;
}

/** 
 * Will create the key of "DisplayName" and add it to the object. If both
 * "GivenName" and "FamilyName" are missing then it will set the "DisplayName"
 * value to "GivenName and FamilyName MISSING".
 * 
 * @param {object} compressedObj
 * @returns {object}
 */
function createDisplayName(compressedObj) {
    if("GivenName" in compressedObj && "FamilyName" in compressedObj) {
        compressedObj["DisplayName"] = compressedObj["GivenName"] + ", " + compressedObj["FamilyName"];
    } else if("GivenName" in compressedObj) {
        compressedObj["DisplayName"] = compressedObj["GivenName"];
    } else if("FamilyName" in compressedObj) {
        compressedObj["DisplayName"] = compressedObj["FamilyName"];
    } else {
        compressedObj["DisplayName"] = "GivenName and FamilyName MISSING";
    }
    return compressedObj;
}

// Section used for basic testing
// var json = require("./input.json");
// var newJson = JSON.stringify(parseAttributes(json), null, 4);
// var fs = require('fs');
// fs.writeFile("myOutput.json", newJson, function(err) {
//     if (err) {
//         console.log(err);
//     }
// });