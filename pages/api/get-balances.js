import notion from "../../util/NotionClient";

const housemateDatabase = "6331a9e194d146098371520964963c71";
const statementLogDatabase = "9958362fb6b549a091207b30cf60ecd3";

export default async function handler(req, res) {
    // Get users
    const {results} = await notion.databases.query({
        database_id: housemateDatabase,
    })
    let returned = []
    let object = {}
    for (const person of results) {
        object[person.properties["Display Name"].title[0].text.content] = {
            "displayName": person.properties["Display Name"].title[0].text.content,
            "peopleProperties": person.properties["Notion Person Object"].people[0],
            "venmo":person.properties["Venmo Link"].rich_text[0].text.link.url,
            "balance": []
        }
        returned.push({
            "displayName": person.properties["Display Name"].title[0].text.content,
            "notionPersonObject": person.properties["Notion Person Object"].people[0]
        })
    }
    // Get balances
    const {results: balances} = await notion.databases.query({
        database_id: statementLogDatabase,
    })
    // const {results: test} = await notion.databases.query({
    //     database_id: "36a32aec38574dca8eb4c076b836272e",
    // })
    for (const person of balances) {
        const currentPerson = person.properties.Name.title[0].text.content
        const propArray = Object.keys(person.properties)
        for (const key of propArray) {
            const splitKey = key.split(" ")
            if (splitKey[0] === "Owed") {
                if (splitKey[2] !== currentPerson) {
                    object[currentPerson].balance.push({
                        name:splitKey[2],
                        amount:person.properties[key].number
                    })
                }
            }
        }
    }



    res.status(200).json(object)
}