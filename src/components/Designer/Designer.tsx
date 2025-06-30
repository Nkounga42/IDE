import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { config } from "./puck.config";

const initialData = {
  blocks: [
    {
      type: "Hero",
      props: {
        title: "Hello there",
        description:
          "Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi.",
        buttonLabel: "Get Started",
      },
    },
  ],
};

const save = (data) => {
  console.log("Contenu publié :", data);
};

export function Designer() {
  return (
      <Puck config={config} data={initialData} onPublish={save} />
  );
}

 