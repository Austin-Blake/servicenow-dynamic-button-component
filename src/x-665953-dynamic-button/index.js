import { createCustomElement } from "@servicenow/ui-core";
import snabbdom from "@servicenow/ui-renderer-snabbdom";

const view = (state, { properties, dispatch }) => {
  // Destructure all properties
  const { label = "Fetch Data", variant = "primary", size = "md", disabled = false, visible = true } = properties;

  // Handle boolean or string representations from ServiceNow configurations
  const isVisible = String(visible) !== "false";
  const isDisabled = String(disabled) === "true";

  // If visibility is explicitly false, render a hidden placeholder
  // to keep the virtual DOM stable without displaying anything.
  if (!isVisible) {
    return <div style={{ display: "none" }}></div>;
  }

  const buttonClasses = `btn btn-${variant} btn-${size}`;

  return (
    <button
      className={buttonClasses}
      style={{ width: "100%", marginBottom: "1rem" }}
      disabled={isDisabled}
      on-click={(e) => {
        e.preventDefault();
        if (isDisabled) return;

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

// createCustomElement('x-665953-dynamic-button', {
//     renderer: { type: snabbdom },
//     view,
//     properties: {
//         value: { default: '' },
//         label: { default: '' },
//         variant: { default: 'primary' },
//         size: { default: 'md' },
//         disabled: { default: false },
//         visible: { default: true } // New property added here
//     }
// });
