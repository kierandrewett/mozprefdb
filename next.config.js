const { resolve } = require("path");

module.exports = {
    sassOptions: {
        includePaths: [resolve(process.cwd(), "scss")],
    },
}