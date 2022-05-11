import { useEffect, useRef } from 'react';

export function useDidMount() {
    const mountRef = useRef(false);

    useEffect(() => { mountRef.current = true }, []);

    return () => mountRef.current;
}


export function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}