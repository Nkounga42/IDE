const initialData: TreeNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      { id: "2", name: "App.tsx", type: "file" , content: 'pas de contenue' },
      { id: "3", name: "index.tsx", type: "file" , content: 'pas de contenue' },
      {
        id: "6",
        name: "components",
        type: "folder",
        children: [
          { id: "7", name: "Button.tsx", type: "file" , content: 'pas de contenue' },
          { id: "8", name: "Modal.tsx", type: "file" , content: 'pas de contenue' },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "public",
    type: "folder",
    children: [{ id: "5", name: "index.html", type: "file" , content: 'pas de contenue' }],
  },
];

export default initialData 