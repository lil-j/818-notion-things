import Link from "next/link";
import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import toast from "react-hot-toast";

export default function Pay() {
    // Data
    const [data, setData] = useState()

    // States
    const [whoBought, setWhoBought] = useState()
    const [contributors, setContributors] = useState([])


    // Fetch Data

    // Paying someone back
    const [venmoOpen, setVenmoOpen] = useState(false)
    const [modal, setModal] = useState(false)
    const [userToPay, setUserToPay] = useState({})
    const [loggedPageId, setLoggedPageId] = useState()
    const [certifyLoading, setCertifyLoading] = useState()

    function initiateReimbursement(e, person) {
        console.log("in")
        e.preventDefault()
        setModal(true)
        setVenmoOpen(false)
        setUserToPay(person)
    }

    async function clearBalance() {
        const res = await fetch("/api/clear-balance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "indebted": {
                    id: data[whoBought].peopleProperties.id,
                    name: whoBought
                },
                "indebtor": {
                    id: data[userToPay.name].peopleProperties.id,
                    name: userToPay.name
                },
                "amount": userToPay.amount,
                "date": new Date().toISOString()
            })
        })
        const json = await res.json();
        setLoggedPageId(json.statement_id)
    }

    const PayBackModal = () => {
        const pay = () => {
            setVenmoOpen(true)
            clearBalance();
            window.open(data[userToPay.name].venmo, "_blank")
        }

        const certify = async () => {
            setCertifyLoading(true)
            let updatedData = data;
            let count = 0;
            for (const person of updatedData[whoBought].balance) {
                await fetch("/api/certify-payment", {
                    method:"POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        page_id: loggedPageId
                    })
                })
                if (person.name === userToPay.name) {
                    updatedData[whoBought].balance[count].amount = 0;
                }
                count ++;
            }
            await setCertifyLoading(false)
            await setModal(false)
            await setData(updatedData);
            await setContributors(Object.entries(updatedData).map(entry => [entry[0], true, entry[1].peopleProperties]))
            toast.success("Thank you for certifying! Payment complete.")
        }
        const closeModal = () => {
            console.log("close")
            if (modal) {
                setModal(false);
            }
        }

        return <motion.div
                className="z-40 h-screen w-screen fixed bg-black/80 overflow-hidden flex items-center justify-center"
            >
                <div
                    className="max-w-lg w-full bg-white shadow-lg fixed z-10"
                >
                    <a className="absolute right-5 hover:underline top-2" onClick={() => setModal(!modal)}>Cancel</a>
                    <div className="h-36 w-full bg-blue-100 flex items-center justify-center">
                        <img className="m-auto w-24 h-24 object-cover rounded-[100%] border border-solid border-white border-4" src={data[userToPay.name].peopleProperties.avatar_url}/>
                    </div>
                    <div className="mt-3 px-4 justify-center">
                        <h4 className="text-center">Pay {userToPay.name} Back</h4>
                        <h5 className="text-center">You Owe: <span className="text-blue-500">${userToPay.amount}</span></h5>
                        <div className="flex justify-center">
                            {
                                !venmoOpen ? <button onClick={pay} className="bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold">Pay on Venmo</button> : <button onClick={certify} className="bg-black text-white px-3 py-2 rounded-lg font-semibold">{!certifyLoading ? "I certify that I paid" : "Loading"}</button>

                            }
                        </div>
                        <p className="text-xs text-center">You must pay {userToPay.name} back in full.</p>

                    </div>
                </div>
            </motion.div>
    }


    useEffect( () => {
        ( async () => {
                const s = await fetch("/api/get-balances")
                const json = await s.json()
                setData(json)
                // Prep States
                console.log(json)
                setContributors(Object.entries(json).map(entry => [entry[0], true, entry[1].peopleProperties]))
            }
        )()

    }, [])

    return <div>
        {
            modal && <AnimatePresence>
                <PayBackModal/>
            </AnimatePresence>
        }
        <div className="px-5 lg:px-0 pt-8 max-w-md mx-auto">
            <Link href="/communal-purchases/log"><a className="hover:underline">Log a Transaction Instead -></a></Link>
            <h1>Pay Someone Back</h1>
            { data ?
                <form className="mb-4">
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div className="col-span-2">
                            <label htmlFor="purchaser" className="block mb-2 text-sm font-medium text-gray-900">Who are you?</label>
                            <select id="purchaser"
                                    value={whoBought}
                                    onChange={(e) => setWhoBought(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                <option value=""></option>
                                {
                                    Object.entries(data).map((entry) => (
                                        <option value={entry[0]}>{entry[0]}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {
                            whoBought && <div className="col-span-2">
                                <h3>👋 Hi, {whoBought}!</h3> <h4>Here's a breakdown of your balances:</h4>
                                {
                                    data[whoBought].balance.map((person) => (
                                        <div className="w-full bg-blue-100 px-4 py-3 rounded-2xl mb-2 relative z-0">
                                            {
                                                person.amount >! 0 && <button onClick={(e) => initiateReimbursement(e, person)} className="absolute right-4 bottom-4 absolute uppercase border-solid border-2 border-black p-1 rounded hover:bg-black active:opacity-70 hover:text-white transition-all">Pay Back -></button>
                                            }
                                            <div className="my-auto items-center">
                                                <img className="w-8 h-8 object-cover rounded-[100%]" src={data[person.name].peopleProperties.avatar_url}/>
                                                <h4>{person.name}</h4>
                                            </div>
                                            {
                                                person.amount > 0 ? <p>You owe them ${person.amount}</p> : <p>You do not owe them anything.</p>
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
                </form>
                :
                <p>Loading</p>
            }
        </div>
    </div>
}