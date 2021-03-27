const Docxtemplater = require('docxtemplater');
var expressions = require('angular-expressions');
var assign = require("lodash.assign");


expressions.filters.up = function(input) {
    if(!input) return input;
    return input.toUpperCase();
}
expressions.filters.low = function(input) {
    if(!input) return input;
    return input.toLowerCase();
}
expressions.filters.sen = function(input) {
    if(!input) return input;
    return input.slice(0,1).toUpperCase() + input.slice(1).toLowerCase();
     
}

const replaceErrors = (key, value) => {
    if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce(function (error, key) {
            error[key] = value[key];
            return error;
        }, {});
    }
    return value;
}

function angularParser(tag) {
    if (tag === '.') {
        return {
            get: function(s){ return s;}
        };
    }
    const expr = expressions.compile(
        tag.replace(/(’|‘)/g, "'").replace(/(“|”)/g, '"')   
    );
    //console.log(tag);
  //  console.log( tag.replace(/(’|‘)/g, "'").replace(/(“|”)/g, '"'));
    return {
        get: function(scope, context) { 
            //     console.log(tag);
            // console.log(context);
            let obj = {};
            const scopeList = context.scopeList;
            const num = context.num;
            for (let i = 0, len = num + 1; i < len; i++) {
                obj = assign(obj, scopeList[i]);
            }
            return expr(scope, obj);
        }
    };
}

function customParser(tag) {
    if (tag === "comma") {
        return {
            get(scope, context) {
                console.log(context.scopePathItem);
                const totalLength = context.scopePathLength[context.scopePathLength.length - 1];
                const index = context.scopePathItem[context.scopePathItem.length - 1];
                const isLast = index === totalLength - 1;
              //  console.log(totalLength + " " + index + " ");
                if (!isLast) {
                    return ',';
                }
                else {
                    return '';
                }
            }
        }
    }
    // if (tag === "newline") {
    //     return {
    //         get(scope, context) {
    //             const totalLength = context.scopePathLength[context.scopePathLength.length - 1];
    //             const index = context.scopePathItem[context.scopePathItem.length - 1];
    //             const isLast = index === totalLength - 1;
    //             if (!isLast) {
    //                 return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
    //             }
    //             else {
    //                 return '';
    //             }
    //         }
    //     }
    // }

    // We use the angularParser as the default fallback
    // If you don't wish to use the angularParser,
    // you can use the default parser as documented here :
    // https://docxtemplater.readthedocs.io/en/latest/configuration.html#default-parser
    return angularParser(tag);
}
const PizZip = require('pizzip');

const errorHandler = (error) => {
    console.log(JSON.stringify({error: error}, replaceErrors));
    if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map(function (error) {
            return error.properties.explanation;
        }).join("\n");
       
    }
    throw error;
}

const parser = (data, form, filename) => {
    return new Promise(async (resolve, reject) => {
        try {
           let zip = new PizZip(data);
           console.log(zip);
            let doc = new Docxtemplater(zip, {parser: customParser, linebreaks: true });
            doc.setData(form);
            doc.render()
            let docBuffer = doc.getZip().generate({type: 'nodebuffer'});
            resolve(docBuffer);
        } catch (e) {
            console.log(filename);
            errorHandler(e);
            reject(e);
        }
    });
}

module.exports = {
    parser: parser
}