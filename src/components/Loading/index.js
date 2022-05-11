import CarLoader from './assets/CarLoader.svg'
import './index.css'
import {useInterval} from "../../utils/hooks";
import {useState} from "react";

export default function Loading() {
    const [width, setWidth] = useState(0)
    useInterval(() => {
        switch (width) {
            case 0:
                setWidth(25);
                break;
            case 25:
                setWidth(50);
                break;
            case 50:
                setWidth(75);
                break;
            case 75:
                setWidth(100);
                break;
            default:
                setWidth(0)
                break;
        }
    },500)

    return (
        <div className="loader-hover">
            <div className="loader">
                <img
                    style={{
                        width: width + '%'
                    }}
                    className="main-loader-bar"
                    src={CarLoader}
                    alt=""
                />
            </div>
        </div>
    )
}