import React from 'react';

function App() {
    function handleClick() {
        const { protocol, hostname } = window.location;
        console.log(protocol);
        console.log(hostname);
        const url = `${protocol}//${hostname}:3000/api/v1/campaigns`;
        fetch(url)
            .then(async res => {
                console.log(res);
                const resJson = await res.json();
                console.log(resJson);
            });
    }

    return (
        <div className='text-red-400'>
            <h1>Hello from Typescript</h1>
            <button onClick={handleClick}>
                Fetch Campaigns
            </button>
        </div>
    );
}

export default App;
