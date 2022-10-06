import notion from "../../util/NotionClient";

// Master DBs
const paymentLogDatabase = "8a03d0afa35148708c3c4206186a6e10";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({message: 'Only POST requests allowed'})
    } else {
        const body = req.body
        const certify = await notion.pages.update({
            page_id: body.page_id,
            properties: {
                "Status": {
                    status: {
                        name: "Confirmed"
                    }
                }
            }
        })

        await res.status(200).json( { success:true } )
    }
}