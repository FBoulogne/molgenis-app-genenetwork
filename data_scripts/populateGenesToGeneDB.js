var fs = require('fs')
var level = require('level')
var fileutil = require('./fileutil')

if (process.argv.length != 5) {
    return console.log('usage: node populateGenesToGeneDB.js path/to/db path/to/genefile path/to/genePredictFile')
}

var filename = process.argv[3]
var genes = fileutil.readGeneFile(filename)

var genePredictFileLines = fs.readFileSync(process.argv[4], 'utf8').split('\n')

var indexOffset = 0

for (var i = 1; i < genePredictFileLines.length-1; i++) {
    var split = genePredictFileLines[i].split('\t')
    var geneId = split[0]
    var genePredScore = split[2]

    // Some genes are not present in genes file
    if (genes[i-1+indexOffset].id !== geneId) {
    	indexOffset++
    }

    genes[i-1+indexOffset].genePredScore = genePredScore

}

var genedb = level(process.argv[2], {valueEncoding: 'json'})
genedb.put('!RNASEQ', genes)
