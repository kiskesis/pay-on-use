import 'regenerator-runtime/runtime'
import React, {useEffect} from 'react'

import './index.css'
import {logout} from "../../near-connection/utils";
import {useNavigate} from "react-router-dom";
import Loading from "../Loading";
import SupportUkraine from './assets/support-ukraine.png';

export default function PageWrapper({ children, isLoading }) {
    const navigate = useNavigate()
    useEffect(() => {
        if (window.walletConnection.isSignedIn()) {
        } else {
            navigate("/")
        }
    }, [navigate])

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <div className="page-wrapper">
            <header className="header">
                <img
                    className="header-logo"
                    src={SupportUkraine}
                    alt=""
                />
                <div className="header-profile-div">
                    <div>{window.accountId}</div>
                    <button
                        className="link"
                        style={{float: 'right', height: '100%'}}
                        onClick={handleLogout}
                    >
                        Sign out
                    </button>
                </div>
            </header>
            {children}
            {isLoading && <Loading />}
        </div>
    )
}
