import 'regenerator-runtime/runtime'
import React, {useEffect} from 'react'

import './index.css'
import {login} from "../../near-connection/utils";
import {useNavigate} from "react-router-dom";

export function Login() {
    // const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (window.walletConnection.isSignedIn()) {
            console.log('true');
            navigate("/validate")
        }
    }, [navigate])

    const handleLogin = async () => {
        await login()
    }

    return (
        <main>
            <h1>Pay on use demo</h1>
            <p style={{textAlign: 'center'}}>
                Idea: pay_on_use, so you pay only when you use service
            </p>
            <p style={{textAlign: 'center'}}>
                <button onClick={handleLogin}>Sign in</button>
            </p>
            <p>
                An application contains that parts:
            </p>
            <ol>
                <li>Login</li>
                <li>Wrap Near</li>
                <li>Add minutes</li>
                <li>Start stream</li>
                <li>Dont want to pay? Pause stream</li>
            </ol>
            <p>
                But the idea is deeper, so:
                <ol>
                    <li>
                        Create NPM module for React for pay on use, with connection to rocketo
                    </li>
                    <li>
                        NPM module that will automatically handle when you on use page and when not and pause stream when you off and start when you want
                    </li>
                    <li>
                        It will open to us new world of pay on use schema
                    </li>
                </ol>
            </p>
            {/*{isLoading && <Loading />}*/}
        </main>
    )
}

