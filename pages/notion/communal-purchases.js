import Log from "../communal-purchases/log";
import Pay from "../communal-purchases/pay";

export default function CommunalPurchases() {
    return <div className="grid grid-cols-2">
        <Log/>
        <Pay/>
    </div>
}