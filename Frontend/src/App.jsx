import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { RoutingLayout } from './RoutingLayout'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {


  return (
    <>
      <BrowserRouter>
        <RoutingLayout />
      </BrowserRouter>
    </>
  )
}

export default App
