import './index.css';
import PageWrapper from "../PageWrapper";
import {useEffect, useState} from "react";
import {utils} from "near-api-js";
import {useNavigate} from "react-router-dom";

export function MainPage() {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);
    const [wrappedNear, setWrappedNear] = useState(0);
    const [stream, setStream] = useState(null);
    const [activeStream, setActiveStream] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        const getStream = async () => {
            const streams = await window.contract.get_account_outgoing_streams({
                "account_id": window.accountId,
                "from": 0,
                "limit": 5,
            });
            console.log('streams', streams);
            const currentStream = streams.find((strm) => strm.receiver_id === "pay-on-use.testnet" && typeof strm.status === "string")
            if (currentStream) {
                setStream(currentStream)
                setActiveStream(currentStream.status === 'Active')
            }
        }
        const getBalance = async () => {
            const returnedBalanced = await window.ftContract.ft_balance_of({
                "account_id": window.accountId
            });
            setBalance(returnedBalanced)
        }
        Promise.all([getBalance(), getStream()]).then(() => setLoading(false))
        window.onclose = pauseStream;
    }, [])

    const depositStream = async () => {
        setLoading(true);
        const msg = stream ? {
            Deposit: {
                request: {
                    stream_id: stream.id
                }
            }
        } : {
            Create: {
                request: {
                    owner_id: window.accountId,
                    receiver_id: "pay-on-use.testnet",
                    tokens_per_sec: 6 * 385802469135802469, // 1 month for 6 NEAR
                },
            },
        }
        await window.ftContract.ft_transfer_call(
            {
                receiver_id: "streaming-r-v2.dcversus.testnet",
                amount: (value * 385802469135802469 * 60).toString(),
                memo: "Roketo transfer",
                msg: JSON.stringify(msg),
            },
            200000000000000,
            1
        );
        setLoading(false);
    }

    const startStream = async () => {
        if (!activeStream) {
            setLoading(true)
            await window.contract.start_stream({
                "stream_id": stream.id,
            }, 200000000000000, 1);
            setLoading(false)
        }
    }

    const pauseStream = async () => {
        if (activeStream) {
            setLoading(true)
            await window.payOnUseContract.pause_stream({
                "stream_id": stream.id,
            }, 300000000000000);
            stream.status = "Pause"
            setStream(stream)
            setActiveStream(false)
            setLoading(false)
        }
    }

    const openAction = () => {
        navigate('/action')
    }

    const wrapNear = async () => {
        await window.ftContract.near_deposit({}, 200000000000000, utils.format.parseNearAmount(wrappedNear.toString()));
    }

    console.log('currentStream', stream);
    console.log('activeStream', activeStream);

    return (
        <PageWrapper isLoading={loading}>
            <div className="App">
                <p>MainPage</p>
                <div className="">
                    <p>
                        Stream Status: {stream?.status}
                    </p>
                    <p>
                        You have minutes left: {stream?.balance ? stream?.balance / 385802469135802469 / 60 : 0}
                    </p>
                    <p>
                        wNear: {Math.floor(utils.format.formatNearAmount(balance.toString()))}
                    </p>
                    <div className="money-inputs">
                        <div className="wnear">
                            <p>
                                Add wnear
                            </p>
                            <input
                                type="number"
                                step={1}
                                min={0}
                                value={wrappedNear}
                                onChange={(e) => setWrappedNear(e.target.value)}
                            />
                            <button onClick={wrapNear}>
                                Wrap near
                            </button>
                        </div>
                        <div className="minutes">
                            <p>
                                Add minutes
                            </p>
                            <input
                                type="number"
                                step={1}
                                min={0}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            <button onClick={depositStream}>
                                Add minutes
                            </button>
                        </div>
                    </div>
                </div>
                <div className="manipulate-stream">
                    <button onClick={startStream} disabled={!stream || activeStream}>
                        Start pay
                    </button>
                    <button onClick={pauseStream} disabled={!stream || !activeStream}>
                        Pause pay
                    </button>
                    <button onClick={openAction} disabled={!stream || !activeStream}>
                        Start using application
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
}
