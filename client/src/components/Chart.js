import { useEffect, useState,useRef } from 'react';

const Chart = () => {

    const [data, setData] = useState([]);
    const wsRef = useRef(null); // Store the WebSocket in a ref so it persists

    useEffect(() => {
        let wsMessage;
        wsRef.current = new WebSocket(process.env.REACT_APP_WSSENDPOINT);

        // Connection opened
        wsRef.current.addEventListener('open', (event) => {
            console.log('WebSocket Open');
        });

        // Listen for messages
        wsRef.current.addEventListener('message', (event) => {
            console.log(event);
            if(event.data.includes('Welcome')){
                setData(event.data);
                return;
            }
            const message = JSON.parse(event.data);
            if(message.channel === 'records'){
                wsMessage = event.data;
            }else if(message.channel === 'performance'){
                wsMessage = event.data;
            }else{
                wsMessage = event.data;
            }
            setData(prevData => [...prevData, wsMessage]);
        });

        // Close WebSocket connection when component unmounts
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    return (
        <div>
            {data}
        </div>
    );
}

export default Chart;