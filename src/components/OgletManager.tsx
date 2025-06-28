import React from "react";

const onglets = [
  { id: "tab1", content: "Tab 1" },
  { id: "tab2", content: "Tab 2" },
  { id: "tab3", content: "Tab 3" },
];


const OgletManager = () => {
  return (
    <>
      <div className="tabs tabs-lift h-full w-full">
        {onglets.map((onglet) => (
          <React.Fragment key={onglet.id}>
            <input
              type="radio"
              name="my_tabs_3"
              className="tab"
              aria-label={onglet.content}
              defaultChecked={onglet.id === "tab2"}
            />
            <div className="tab-content bg-base-100 border-base-300 h-full p-6">
              {onglet.content}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default OgletManager;

       