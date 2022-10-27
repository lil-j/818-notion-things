import notion from "../../util/NotionClient";

const statementLogDatabase = "9958362fb6b549a091207b30cf60ecd3";
const transactionLogDatabase = "c5f1bafcd6694020bab6f5f6ae4e0e8a";

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
                                number: person.properties["Owed to " + body.purchaser.name].number + (body.total_cost / (body.indebted.length + 1))
                            }
                        }
                    })
                }
            }
        }
        await res.status(200).json(page)
    }

}