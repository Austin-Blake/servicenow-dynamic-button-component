import { createCustomElement } from "@servicenow/ui-core";
import snabbdom from "@servicenow/ui-renderer-snabbdom";

const view = (state, { properties, dispatch }) => {
  // Extract properties safely with fallback to empty object if properties is undefined
  const props = properties || {};
  const { label = "Submit", variant = "primary", size = "md", disabled = false, visible = true } = props;

  // Safe boolean evaluation: render UNLESS explicitly set to false or string "false"
  const isVisible = !(visible === false || visible === "false");
  const isDisabled = disabled === true || disabled === "true";

  if (!isVisible) {
    return <div style={{ display: "none" }}></div>;
  }

  // Define inline base styling so the button renders even without global Bootstrap CSS inside Shadow DOM
  const baseButtonStyle = {
    display: "inline-block",
    width: "100%",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
    borderRadius: "4px",
    border: "none",
    cursor: isDisabled ? "not-allowed" : "pointer",
    backgroundColor: variant === "destructive" ? "#d9534f" : variant === "secondary" ? "#6c757d" : "#293e40",
    color: "#ffffff",
    opacity: isDisabled ? 0.6 : 1,
    marginBottom: "1rem",
  };

  return (
    <button
      style={baseButtonStyle}
      disabled={isDisabled}
      on-click={(e) => {
        e.preventDefault();
        if (isDisabled) return;

        // Dispatch custom DOM event for Catalog Client Scripts
        e.target.dispatchEvent(
          new CustomEvent("MYORG_BUTTON_CLICKED", {
            bubbles: true,
            composed: true, // Pierces Shadow DOM boundary
            detail: { clickedAt: Date.now() },
          })
        );

        dispatch("NOW_CATALOG_VARIABLE_VALUE_CHANGED", { value: Date.now().toString() });
      }}
    >
      {label}
    </button>
  );
};

createCustomElement("x-665953-dynamic-button", {
  renderer: { type: snabbdom },
  view,
  initialState: { value: "", label: "Submit", variant: "primary", size: "md", disabled: false, visible: true },
  properties: {
    value: { schema: { type: "string", default: "" } },
    label: { schema: { type: "string", default: "Submit" } },
    variant: { schema: { type: "string", default: "primary" } },
    size: { schema: { type: "string", default: "md" } },
    disabled: { schema: { type: "boolean", default: false } },
    visible: { schema: { type: "boolean", default: true } },
  },
});
