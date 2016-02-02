#! /usr/bin/env node

var helpers = {};
var uuid = require("node-uuid");
var Q = require("q");
var _ = require("lodash");
var fs = require("fs");
var argparse = require("argparse");

var exchangesSuffixes = {
    amex: "A",
    nasdaq: "O",
    nyse: "N"
};
var csv = require("csv-parser");
var path = require("path");


var parser = new argparse.ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Parse symbol lists'
});
parser.addArgument(['-f', '--filter'], {help: "the filter on which lists need to be created", required: true});
parser.addArgument(['-i', '--input'], {help: "the JSON file containing path to csv files", required: true});
parser.addArgument(['-o', '--output'], {help: "the output directory", required: true});



/**
 * Parse the ticker files into csv
 * @param files
 */
var parseSymbolFiles = function (files) {
    var deferred = Q.defer();
    var promises = [];
    _.each(files, function (file) {
        var promise = Q.defer();
        promises.push(promise.promise);
        var symbols = [];
        fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', function (data) {
                data.__exchange = file.exchange;
                symbols.push(data);
            })
            .on('end', function () {
                promise.resolve(symbols);
            });
    });
    Q.allSettled(promises)
        .then(function (results) {
            var symbols = [];
            _.each(results, function (result) {
                symbols = symbols.concat(JSON.parse(JSON.stringify(result.value)));
            });
            deferred.resolve(symbols);
        })
        .catch(function (error) {
            deferred.reject(error);
        });
    return deferred.promise;
};

/**
 * Gets the RIC code for ticker
 * @param ticker
 * @param exchange
 */
var getRICForTicker = function (ticker, exchange) {
    var ric = ticker;
    if (_.includes("$")) {
        ric = ticker.replace("$", "").toUpperCase();
    }
    else if (_.includes(ticker, ".")) {
        ric = ticker.split(".")[0].toUpperCase();
    }
    else if (_.includes(ticker, "^")) {
        var parts = ticker.split("^");
        ric = parts[0].toUpperCase() + "_p" + parts[1].toLowerCase();
    }
    ric = ric + "." + exchangesSuffixes[exchange];
    return ric;
};

var filter = function (filterField, symbols) {
    var filtered = {};

    _.each(symbols, function (symbol) {
        var filterValue = symbol[filterField].trim();
        if (!filtered[filterValue]) {
            filtered[filterValue] = [];
        }
        var ticker = (symbol.Symbol || symbol.symbol).trim();
        var ric = getRICForTicker(ticker, symbol.__exchange);
        filtered[filterValue].push(ric);
        filtered[filterValue].sort();
    });
    return filtered;
};

function createLists(filterName, filteredData, outputDir) {
    var lists = [];
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    var listsPath = path.join(outputDir, 'ms-lists');
    if(fs.existsSync(listsPath)){
        fs.rmdirSync(listsPath);
    }
    fs.mkdirSync(listsPath);

    _.forOwn(filteredData, function (symbols, filter) {
        filter = _.startCase(filter.replace(/\//gi, '_'));
        var listName = filterName + ' - ' + filter;
        var listId = uuid.v4();

        var output = '<?xml version="1.0"?>\n' +
            '<InstrumentList xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
            'xmlns:xsd="http://www.w3.org/2001/XMLSchema" Name="'
            + listName + '﻿" Key="' + listName + '" IsExplorationResult="false">\n' +
            '<Instruments>';

        _.each(symbols, function (symbol) {
            output += '﻿<I s="' + symbol + '" />\n';
        });
        output += '</Instruments>\n</InstrumentList>';

        var listEntry = '﻿<MasterFileEntry ListName="' + listName + '" ListId="' + listId + '" ListKey="' + listName + '" />';
        lists.push(listEntry);
        fs.writeFileSync(listsPath + '/List-' + listId + ".xml", output);
    });

    fs.writeFileSync(outputDir + '/masterlist.txt', lists.join('\n'));

}


var begin = function(json, filterName, outputDir){
    var lists = require('./' + json);
    parseSymbolFiles(lists)
        .then(function (symbols) {
            var filtered = filter("industry", symbols);
            return filtered;
        })
        .then(function(filtered){
            createLists(filterName, filtered, outputDir);
        })
        .catch(function (error) {
            console.log(error);
        });
};

var args = parser.parseArgs();
begin(args.input, args.filter, args.output);

module.exports = helpers;