import React, {useEffect} from 'react'
import './index.css'
import {useNavigate} from "react-router-dom";
import PageWrapper from "../PageWrapper";

export function ActionPage() {
    const navigate = useNavigate()

    useEffect(() => {
        if (window.walletConnection.isSignedIn()) {
            navigate("/")
        }
    }, [navigate])

    return (
        <PageWrapper>
            <div>
                Page with your functionality
            </div>
        </PageWrapper>
    )
}

