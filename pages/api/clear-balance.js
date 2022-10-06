import notion from "../../util/NotionClient";

// Master DBs
const housemateDatabase = "6331a9e194d146098371520964963c71";
const statementLogDatabase = "e2eace692fee4bb0b9bad935cca2e642";
const transactionLogDatabase = "36a32aec38574dca8eb4c076b836272e";
const paymentLogDatabase = "8a03d0afa35148708c3c4206186a6e10";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({message: 'Only POST requests allowed'})
    } else {
        // Log Attempt
        const body = req.body
        console.log(body)

        const paymentLog = await notion.pages.create({
            parent: {
                database_id: paymentLogDatabase
            },
            properties: {
                "Name": {
                    title: [
                        {
                            text: {
                                content: body.indebted.name + " paid " + body.indebtor.name + " back $" + body.amount
                            }
                        }
                    ]
                },
                "From": {
                    people: [
                        {
                            id: body.indebted.id
                        }
                    ]
                },
                "To": {
                    people: [
                        {
                            id: body.indebtor.id
                        }
                    ]
                },
                "Amount": {
                    number: body.amount
                },
                "Date": {
                    date: {
                        start: body.date
                    }
                }
            }
        })

        // After the payment log is successfully updated, we can update the final statement

        // Let's start by getting the row that contains the indebted person
        const {results: statementLog} = await notion.databases.query({
            database_id: statementLogDatabase
        })
        for (const person of statementLog) {
            // Find match
            if (person.properties["Name"].title[0].text.content === body.indebted.name) {
                await notion.pages.update({
                    page_id: person.id,
                    properties: {
                        ["Owed to " + body.indebtor.name]: {
                            number: 0
                        }
                    }
                })
            }
        }
        await res.status(200).json({success: true, statement_id: paymentLog.id})
    }
}