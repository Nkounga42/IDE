// components/Sidebar.tsx
import { useDrag } from "react-dnd";

const COMPONENT = "component";

const components = [
  { id: "btn", label: "Bouton", html: `<button class="btn btn-primary">Clique</button>` },
  { id: "input", label: "Champ texte", html: `<input class="input input-bordered" placeholder="Texte..." />` },
  { id: "checkbox", label: "Checkbox", html: `<input type="checkbox" class="checkbox" />` },
];

const DraggableItem = ({ item }) => {
  const [, drag] = useDrag(() => ({
    type: COMPONENT,
    item,
  }));

  return (
    <div ref={drag} className="p-2 border rounded cursor-move hover:bg-base-300">
      {item.label}
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="w-64 p-4 border-r border-base-300 bg-base-100 space-y-2">
      <h2 className="text-lg font-bold mb-2">Composants</h2>
      {components.map((item) => (
        <DraggableItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Sidebar;
