// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import notion from "../../util/NotionClient";

const database_id = "9426a518160c41b8add614fc01354ca1"

export default async function handler(req, res) {
    const {results} = await notion.databases.query({
        database_id: database_id,
    })
    let count = 0;
    for (const page of results) {
        console.log(page)
        if (page.properties["One-Time"].checkbox &&
            page.properties["House Inventory"].status &&
            !page.properties["Archive"].checkbox) {
            if (page.properties["House Inventory"].status.name === "High") {
                //  Archive Page if condition is true
                await notion.pages.update({
                    page_id: page.id,
                    properties: {
                        "Archive": true
                    }
                })
                count++
            }
        }
    }
    // await notion.pages.update({
    //   page_id: database_id,
    //
    // })
    res.status(200).json({
        house_name: process.env.HOUSE_NAME,
        success: true,
        archiveCount: count
    })
    // res.status(200).json({
    //   results
    // })
}
