// FILEPATH: d:/web master/SAAS/IDE/src/App.tsx

import { useState } from "react";
import EditionArea from "./pages/EditionArea";
import Sidebar from "./components/Sidebar";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragBuilderPage from "./pages/DragBuilder";
import { Play } from "lucide-react";

const App = () => {
  const [dragMode, setDragMode] = useState(false);

  const handleCodeChange = (newCode: string) => {
    // console.log("Code modifié :", newCode);
  };

  const fontSize = 14;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen w-full flex flex-col bg-base-200">
        <div className="flex-1 flex">
          <EditionArea
            fontSize={fontSize}
            handleCodeChange={handleCodeChange}
            setDragMode={setDragMode}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
