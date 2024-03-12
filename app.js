import express from "express";
import {apiKey} from "./src/constants/constants.js";
import {validateFilterClause} from "./src/validators/validateFilterClause.js";
import {applyFilters} from "./src/filters/applyFilters.js";

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/:formId/filteredResponses', async (req, res) => {
    let filters

    try {
        filters = JSON.parse(req.query.filters)
    }
    catch(e) {
        console.log(e)
        res.send('Failed to parse JSON filters')
        return
    }

    if (!validateFilterClause(filters)) {
        res.send('Failed to validate filters')
        return
    }

    const url = new URL(`https://api.fillout.com/v1/api/forms/${req.params.formId}/submissions`)

    for (const param in req.query) {
        if (   param === 'filters'
            // must apply these next two after the project-specific filtration
            || param === 'limit'
            || param === 'offset' ) continue

        url.searchParams.append(param, req.query[param])
    }

    const data = await fetch(
        url,
        { headers: { Authorization: `Bearer ${apiKey}` } }
    )

    const json = await data.json()

    const filteredResponses = applyFilters(json.responses, filters)

    // these are the direct Fillout API query params, but they have to be applied
    // after the fact, because if limit is 1, and there's only 1 response, then the
    // filtration (within this project) could bring it down to 0, and there would be 0
    // answers, but there should be 1; so we do these query params after applying the
    // project-specific filters (not sure if this was intended in the scope of the
    // project, but there's no way to make it work otherwise)
    const slicedResponses = filteredResponses
        .slice(req.query.offset || 0, filteredResponses.length)
        .slice(0, req.query.limit || filteredResponses.length)

    res.send(slicedResponses)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
