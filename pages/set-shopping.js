import {useEffect, useState} from "react";

export default function setShopping() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    useEffect( () => {
        fetch('/api/set-shopping')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    return <div className="h-screen w-screen flex items-center justify-center flex-col text-center">
        {
            loading ? <h1 className="font-extrabold text-6xl">Loading Function</h1> :
                data.success ? <div>
                    <h1 className="font-extrabold text-6xl text-green-600">Success</h1>
                    <h2 className="font-bold text-3xl text-green-300">{data.archiveCount} Cells Updated</h2>
                </div> :
                    <h1 className="font-extrabold text-6xl text-red-600">Unknown Error</h1>
        }
    </div>
}