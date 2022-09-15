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
            loading ? <div className="flex items-center justify-center">
                    <h1 className="font-extrabold text-6xl pr-4">
                        Loading Function</h1>
                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                </div> :
                data.success ? <div>
                        <h2 className="font-bold tracking-tight">{data.house_name}</h2>
                        <h1 className="font-extrabold text-6xl text-green-600 tracking-tight">Success</h1>
                        <h2 className="text-2xl text-green-300 tracking-tight">{data.archiveCount} Cells Updated</h2>
                    </div> :
                    <h1 className="font-extrabold text-6xl text-red-600">Unknown Error</h1>
        }
    </div>
}
