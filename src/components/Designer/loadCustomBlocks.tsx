// src/grapes/customBlocks.ts
import type grapesjs from "grapesjs";

const loadCustomBlocks = (editor: grapesjs.Editor) => {
  const bm = editor.BlockManager;
 
  bm.add("daisy-hero", {
    label: "Hero",
    category: "DaisyUI",
    content: {
      type: "default",
      components: "<h1 class='text-5xl font-bold'>Bienvenue</h1>",
    },
  });


  bm.add("custom-button", {
    label: "Bouton",
    category: "DaisyUI",
    content: `<button class="btn btn-primary">Clique</button>`,
  });

  
  bm.add("custom-input", {
    label: "Champ texte",
    category: "DaisyUI",
    content: `<input class="input input-bordered" placeholder="Texte..." />`,
  });

  
  bm.add("custom-checkbox", {
    label: "Checkbox",
    category: "DaisyUI",
    content: `<input type="checkbox" class="checkbox" />`,
  });
  console.log('bm ', bm.get('daisy-hero'))
};
export default loadCustomBlocks;
