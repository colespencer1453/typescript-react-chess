import Chess from './Chess';
import {SocketContext, socket} from './contexts/socket';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Chess/>
    </SocketContext.Provider>
  );
}

export default App;
