import Link from "next/link";
import {useEffect, useState} from "react";
import {colors} from "../../util/Colors";

export default function Log({hideBack}) {
    // Data
    const [data, setData] = useState()

    // States
    const [whoBought, setWhoBought] = useState()
    const [contributors, setContributors] = useState([])
    const [transactionName, setTransactionName] = useState()
    const [cost, setCost] = useState()
    const [confirmation, setConfirmation] = useState()

    // Loading
    const [loading, setLoading] = useState()
    const [displayResult, setDisplayResult] = useState()



    // Fetch Data
    useEffect( () => {
        ( async () => {
                const s = await fetch("/api/get-balances")
                const json = await s.json()
                setData(json)
                // Prep States
                setWhoBought(Object.entries(json)[0][0])
                console.log(json)
                setContributors(Object.entries(json).map(entry => [entry[0], true, entry[1].peopleProperties]))
            }
        )()

    }, [])

    async function submitForm(e) {
        e.preventDefault()
        setLoading(true)
        if (confirmation) {
            await logTransaction();
            setLoading(false)
            setDisplayResult({
                type:"success",
                message: "added!"
            })
        } else {
            setDisplayResult({
                type:"error",
                message: "must pinky promise"
            })
            setLoading(false)
        }
    }

    async function logTransaction() {
        let indebtedArray = [];
        let indebtedArrayWithName = [];
        contributors.forEach(contributor => {
            if (contributor[1] && contributor[0] !== whoBought) {
                indebtedArray.push({
                    id: contributor[2].id
                })
                indebtedArrayWithName.push({
                    id: contributor[2].id,
                    name: contributor[0]
                })
            }
        })
        const res = await fetch("/api/log-transaction", {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name":transactionName,
                "purchaser": {
                    "id": data[whoBought].peopleProperties.id,
                    "name":whoBought
                },
                "total_cost": parseInt(cost),
                "indebted": indebtedArray,
                "indebted_with_name": indebtedArrayWithName,
                "date": new Date().toISOString()
            })
        })
        return await res.json()
    }

    return <div className="lg:px-0 max-w-md mx-auto mt-8">
        <div className="mx-5">
            {
                !hideBack &&
                <Link href="/communal-purchases/pay"><a className="hover:underline">Pay Someone Back Instead
                    -></a></Link>

            }
            <h1 className="leading-tight">Log a Transaction</h1>
        </div>

        { data ?
        <form className="mx-5 mb-4">
            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div className="col-span-2">
                    <label htmlFor="purchaser" className="block mb-2 text-sm font-medium text-gray-900">Who bought it</label>
                    <select id="purchaser"
                            value={whoBought}
                            onChange={(e) => setWhoBought(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                        {
                            Object.entries(data).map((entry) => (
                                <option value={entry[0]}>{entry[0]}</option>
                            ))
                        }
                    </select>
                </div>
                {
                    whoBought && <div className="col-span-2">
                        <label htmlFor="purchaser" className="block mb-2 text-sm font-medium text-gray-900">Who's contributing:</label>
                        <div className="flex items-start">
                            {
                                contributors && contributors.map((entry, index) => {
                                    if (entry[0] != whoBought) return <>
                                        <div className="flex items-center h-5">
                                            <input id={entry[0]} type="checkbox" value=""
                                                   checked={entry[1]}
                                                   onChange={() => {
                                                       let contrTemp = [...contributors]
                                                       contrTemp[index][1] = !contrTemp[index][1]
                                                       setContributors(contrTemp)
                                                   }}
                                                   className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300"
                                                   required=""/>
                                        </div>
                                        <label htmlFor={entry[0]}
                                               className="flex items-center ml-2 text-sm font-medium text-gray-900 mr-4">
                                            <img className="rounded-[100%] h-6 w-6 mr-2" src={entry[2].avatar_url}/>
                                            {entry[0]}
                                        </label>
                                    </>

                                })
                            }
                        </div>
                    </div>
                }
            </div>
            <div className="grid grid-cols-2">
                <div>
                    <label htmlFor="transaction_name"
                           className="block mb-2 text-sm font-medium text-gray-900">Transaction
                        Name</label>
                    <input type="text" id="transaction_name"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                           placeholder="A gallon of eggs"
                           value={transactionName}
                           onChange={(e) => setTransactionName(e.target.value)}
                           required/>
                </div>
                <div>
                    <label htmlFor="cost"
                           className="block mb-2 text-sm font-medium text-gray-900">Cost (USD)</label>
                    <input type="number" id="cost"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                           placeholder="45"
                           value={cost}
                           onChange={(e) => setCost(e.target.value)}
                           required/>
                </div>
            </div>

            <div className="flex items-start mb-6 mt-3">
                <div className="flex items-center h-5">
                    <input id="promise" type="checkbox" value=""
                           checked={confirmation}
                           onChange={() => {setConfirmation(!confirmation)}}
                           className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300"
                           required=""/>
                </div>
                <label htmlFor="promise"
                       className="ml-2 text-sm font-medium text-gray-900"

                >I pinky promise this is true</label>
            </div>
            <button type="submit"
                    onClick={submitForm}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {!loading ? "Submit" : "Loading"}
            </button>
            {
                displayResult && <p className="text-sm tracking-tight" style={{color:colors[displayResult.type]}}>{displayResult.message}</p>
            }
        </form> : <p>Loading</p>}
    </div>
}