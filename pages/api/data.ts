import { readFileSync } from 'fs'
import { resolve } from 'path'

export default (req, res) => {
    res.json(
        readFileSync(resolve(process.cwd(), "data", "preferences.json"), "utf-8")
    );
}