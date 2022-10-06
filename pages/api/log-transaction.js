import notion from "../../util/NotionClient";

const housemateDatabase = "6331a9e194d146098371520964963c71";
const statementLogDatabase = "e2eace692fee4bb0b9bad935cca2e642";
const transactionLogDatabase = "36a32aec38574dca8eb4c076b836272e";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
    } else {
        // const body = JSON.parse(req.body)
        const body = req.body
        const page = await notion.pages.create({
            parent: {
                database_id: transactionLogDatabase,
            },
            properties: {
                "Transaction Name": {
                    title: [
                        {
                            text: {
                                content: body.name
                            }
                        }
                    ]
                },
                "Purchaser": {
                    people:
                        [
                            {
                                id: body.purchaser.id
                            }
                        ]
                },
                "Total Cost": {
                    number: body.total_cost
                },
                "Indebted": {
                    people: body.indebted
                },
                "Date": {
                    date: {
                        start: body.date
                    }
                }
            }
        })

        // Update statement
        const {results: statementLog} = await notion.databases.query({
            database_id: statementLogDatabase
        })
        // Go through each person
        for (const ting of body.indebted_with_name) {
            for (const person of statementLog) {
                console.log(person)
                // Find match
                if (person.properties["Name"].title[0].text.content === ting.name) {
                    console.log("Match found, ", body.total_cost / body.indebted.length)
                    await notion.pages.update({
                        page_id: person.id,
                        properties: {
                            ["Owed to " + body.purchaser.name]: {
                                number: person.properties["Owed to " + body.purchaser.name].number + (body.total_cost / body.indebted.length)
                            }
                        }
                    })
                }
            }
        }
        await res.status(200).json(page)
    }

}