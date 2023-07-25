// import yaml
const yaml = require('yaml')
const fs = require('fs')
const paraser = require('./paraser')

let yamlStr = fs.readFileSync('profile.yaml','utf8')

let profile =  yaml.parse(yamlStr)

fs.writeFile('profile.json',JSON.stringify(profile),err => {
    if (err) {
        console.error(err);
    }
})

let result = paraser.main(profile);


console.log(profile)


