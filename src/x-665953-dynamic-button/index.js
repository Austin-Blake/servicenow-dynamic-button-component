import { createCustomElement, actionTypes } from "@servicenow/ui-core";
import snabbdom from "@servicenow/ui-renderer-snabbdom";
import styles from "./styles.scss";

const view = (state, { dispatch }) => {
  const { label, disabled, visible, loading, variant, align, size } = state;

  const isVisible = visible === true || visible === "true";
  if (!isVisible) {
    return null;
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
    <div className={`dynamic-button-wrapper align-${align || "left"}`}>
      <button
        type="button"
        className={`dynamic-btn variant-${variant || "primary"} size-${size || "medium"} ${isLoading ? "is-loading" : ""}`}
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
    visible: { default: false, reflect: true },
    loading: { default: false, reflect: true },
    variant: { default: "primary", reflect: true }, // 'primary', 'secondary', 'danger'
    align: { default: "left", reflect: true }, // 'left', 'center', 'right', 'full'
    size: { default: "medium", reflect: true }, // 'small', 'medium', 'large'
  },
  actionHandlers: {
    [actionTypes.COMPONENT_PROPERTY_CHANGED]: ({ action, updateState }) => {
      const { name, value } = action.payload;
      updateState({ [name]: value });
    },
  },
});
