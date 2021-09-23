
import Triangular from './components/Triangular.js'
import 'bootstrap/dist/css/bootstrap.min.css'; 

function App() {
  return (
    <div className="App">
      {/* Triangular is component that contains buttons and a canvas board
       for drawing triangles according to several options */}
      <Triangular />
    </div>
  );
}

export default App;
