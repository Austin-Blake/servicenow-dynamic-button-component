import { createCustomElement, actionTypes } from "@servicenow/ui-core";
import snabbdom from "@servicenow/ui-renderer-snabbdom";
import styles from "./styles.scss";

const view = (state, { dispatch }) => {
  const { label, disabled, visible, loading, variant } = state;

  // STRICT VISIBILITY CHECK:
  // Only render if visible is explicitly true or 'true'
  const isVisible = visible === true || visible === "true";
  if (!isVisible) {
    return null; // Renders completely empty until set to true
  }

  const handleClick = (e) => {
    e.preventDefault();

    if (disabled === true || disabled === "true" || loading === true || loading === "true") {
      return;
    }

    e.target.dispatchEvent(
      new CustomEvent("DYNAMIC_BUTTON_CLICKED", { bubbles: true, composed: true, detail: { label: label, timestamp: Date.now() } })
    );
  };

  const isBtnDisabled = disabled === true || disabled === "true" || loading === true || loading === "true";
  const isLoading = loading === true || loading === "true";

  return (
    <div className="dynamic-button-wrapper">
      <button
        type="button"
        className={`dynamic-btn variant-${variant || "primary"} ${isLoading ? "is-loading" : ""}`}
        disabled={isBtnDisabled}
        on-click={handleClick}
      >
        {isLoading ? "Processing..." : label || "Execute Action"}
      </button>
    </div>
  );
};

createCustomElement("x-665953-dynamic-button", {
  renderer: { type: snabbdom },
  view,
  styles,
  properties: {
    label: { default: "Execute Action", reflect: true },
    disabled: { default: false, reflect: true },
    visible: { default: false, reflect: true }, // Default strictly false
    loading: { default: false, reflect: true },
    variant: { default: "primary", reflect: true },
  },
  actionHandlers: {
    [actionTypes.COMPONENT_PROPERTY_CHANGED]: ({ action, updateState }) => {
      const { name, value } = action.payload;
      updateState({ [name]: value });
    },
  },
});
