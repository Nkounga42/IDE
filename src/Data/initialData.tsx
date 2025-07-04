const initialData: TreeNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      { 
        id: "2", 
        name: "App.tsx", 
        type: "file",
        content: `import React from 'react';

const App = () => {
  return (
    <div>
      <h1>Bienvenue dans App.tsx</h1>
    </div>
  );
};

export default App;
`
      },
      { 
        id: "3", 
        name: "index.css", 
        type: "file",
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`
      },
      {
        id: "6",
        name: "components",
        type: "folder",
        children: [
          { 
            id: "7", 
            name: "Button.js", 
            type: "file",
            content: `import React from 'react';

type ButtonProps = {
  label: string;
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

export default Button;
`
          },
          { 
            id: "8", 
            name: "Modal.tsx", 
            type: "file",
            content: `import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
`
          },
        ],
      },
    ],
  }, 
];


export default initialData 