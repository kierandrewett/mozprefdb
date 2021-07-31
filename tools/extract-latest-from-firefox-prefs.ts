import axios from "axios";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const FIREFOX_PREFS_URL = "https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/app/profile/firefox.js";
const FIREFOX_PREFS_VERSION = "92.0"; // update this whenever you rerun this script.

let prefs = JSON.parse(
    readFileSync(
        resolve(process.cwd(), "data", "preferences.json"),
        "utf-8"
    )
);

const extract = (line: string) => {
    const prefix = "pref(";
    const prefPrefix = line.indexOf(prefix);
    if(prefPrefix == -1) return;

    const rest = line.substring(prefPrefix + prefix.length, line.length);
    const restClean = rest.split(")")[0];

    const jsonReady = restClean
        .replace(/\*.*?\*/, "")
        .replace(/\/.*?\n/, "")
        .replace(/\"\, /, `": `)
        .replace(/\"\,/, `": `)
        .replace(/ \/\//, "");

    if(jsonReady.split(`":`)[1].trim().length == 0) return;

    const dirty = `{ ${jsonReady} }`;
    let parsed;

    try {
        parsed = JSON.parse(dirty);
    } catch(e) {
        console.error(`Failed to parse:`, e, dirty);
    }

    return parsed;
}

axios.get(FIREFOX_PREFS_URL).then(async ({ data }) => {
    const lines = data.split("\n");

    for await(const ln of lines) {
        const d = extract(ln);

        if(d) {
            if(!prefs[Object.keys(d)[0]]) prefs[Object.keys(d)[0]] = {};

            prefs[Object.keys(d)[0]] = {
                ...prefs[Object.keys(d)[0]],
                default_value: Object.entries(d)[0][1],
                last_updated: FIREFOX_PREFS_VERSION
            }
        }
    }

    console.log(Object.keys(prefs).length);

    prefs = Object.fromEntries(Object.entries(prefs).sort())

    console.log(Object.keys(prefs).length);

    writeFileSync(
        resolve(process.cwd(), "data", "preferences.json"),
        JSON.stringify(prefs, null, 2)
    )
})