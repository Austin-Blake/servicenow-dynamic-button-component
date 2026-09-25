import { createCustomElement, actionTypes } from "@servicenow/ui-core";
import snabbdom from "@servicenow/ui-renderer-snabbdom";
import styles from "./styles.scss";

const view = (state, { dispatch }) => {
  const { label, disabled, visible, loading, variant, align, size, tooltip, id, buttonId } = state;

  const isVisible = visible === true || visible === "true";
  if (!isVisible) {
    return null;
  }

  const activeId = id || buttonId || "";

  const handleClick = (e) => {
    e.preventDefault();

    if (disabled === true || disabled === "true" || loading === true || loading === "true") {
      return;
    }

    e.target.dispatchEvent(
      new CustomEvent("DYNAMIC_BUTTON_CLICKED", {
        bubbles: true,
        composed: true,
        detail: { buttonId: activeId, id: activeId, label: label || "", timestamp: Date.now() },
      })
    );
  };

  const isBtnDisabled = disabled === true || disabled === "true" || loading === true || loading === "true";
  const isLoading = loading === true || loading === "true";

  return (
    <div className={`dynamic-button-wrapper align-${align || "left"}`} data-tooltip={tooltip && tooltip !== "" ? tooltip : null}>
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
    id: { default: "", reflect: true },
    buttonId: { default: "", reflect: true },
    label: { default: "Execute Action", reflect: true },
    disabled: { default: false, reflect: true },
    visible: { default: false, reflect: true },
    loading: { default: false, reflect: true },
    variant: { default: "primary", reflect: true },
    align: { default: "left", reflect: true },
    size: { default: "medium", reflect: true },
    tooltip: { default: "", reflect: true },
  },
  actionHandlers: {
    [actionTypes.COMPONENT_PROPERTY_CHANGED]: ({ action, updateState }) => {
      const { name, value } = action.payload;
      if (name === "id" || name === "buttonId" || name === "buttonid" || name === "button-id") {
        updateState({ id: value, buttonId: value });
      } else {
        updateState({ [name]: value });
      }
    },
  },
});
