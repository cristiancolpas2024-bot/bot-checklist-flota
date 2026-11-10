import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { iniciarReenvioAutomatico } from './services/remote';

iniciarReenvioAutomatico();

createRoot(document.getElementById('root')!).render(<App />);
