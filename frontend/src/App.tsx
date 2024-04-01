import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // Make sure to run `npm run dev` for frontend and backend
  // Make sure backend is running on port 8000 (or change vite.config.ts proxy settings)
  function apiReqExample() {
    // Don't have to use XMLHttpRequest (e.g., could use axios)
    const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/');
    xhr.onload = function() {
      if (xhr.status === 200) {
        alert(xhr.responseText);
      }
    };
    xhr.send();
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Grocery Aid</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p></p>
        <button onClick={() => apiReqExample() }>
          Test API Request
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
