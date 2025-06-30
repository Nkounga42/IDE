export const config = {
  components: {
    Hero: {
      label: "Hero Section",
      fields: {
        title: { type: "text", defaultValue: "Hello there" },
        description: {
          type: "textarea",
          defaultValue:
            "Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi.",
        },
        buttonLabel: { type: "text", defaultValue: "Get Started" },
        className: { type: "text", label: "Classe CSS personnalisée" },
      },
      render: ({ title, description, buttonLabel, className }) => (
        <div className={`hero min-h-screen bg-base-200 ${className || ""}`}>
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">{title}</h1>
              <p className="py-6">{description}</p>
              <button className="btn btn-primary">{buttonLabel}</button>
            </div>
          </div>
        </div>
      ),
    }, 
    Example: {
      fields: {
        leftColumn: {
          type: "slot",
        },
        rightColumn: {
          type: "slot",
        },
      },
      render: ({ leftColumn: LeftColumn, rightColumn: RightColumn }) => {
        return (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <LeftColumn />
            <RightColumn />
          </div>
        );
      },
    },
    Card: {
      render: ({ text }) => <div>{text}</div>,
    },
  },
};