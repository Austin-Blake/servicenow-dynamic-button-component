import { createCustomElement, actionTypes } from "@servicenow/ui-core";
import snabbdom from "@servicenow/ui-renderer-snabbdom";
import styles from "./styles.scss";

const view = (state, { dispatch }) => {
  const { label, disabled, visible, loading, variant, align, size, tooltip, id, buttonId, value, ariaLabel, icon } = state;

  const isVisible = visible === true || visible === "true";
  if (!isVisible) {
    return null;
  }

  const activeId = id || buttonId || value || "";

  const handleClick = (e) => {
    e.preventDefault();

    if (disabled === true || disabled === "true" || loading === true || loading === "true") {
      return;
    }

    // Enriched Payload: Pass everything the Client Script might ever need
    e.target.dispatchEvent(
      new CustomEvent("DYNAMIC_BUTTON_CLICKED", {
        bubbles: true,
        composed: true,
        detail: { buttonId: activeId, id: activeId, value: value || activeId, label: label || "", variant: variant, timestamp: Date.now() },
      })
    );
  };

  const isBtnDisabled = disabled === true || disabled === "true" || loading === true || loading === "true";
  const isLoading = loading === true || loading === "true";
  const tooltipText = tooltip && tooltip !== "" ? tooltip : null;

  // Use ariaLabel if provided, otherwise fallback to the visual label
  const accessibleLabel = ariaLabel && ariaLabel !== "" ? ariaLabel : label || "Execute Action";

  return (
    <div className={`dynamic-button-wrapper align-${align || "left"}`}>
      <button
        type="button"
        className={`dynamic-btn variant-${variant || "primary"} size-${size || "medium"} ${isLoading ? "is-loading" : ""}`}
        disabled={isBtnDisabled}
        data-tooltip={tooltipText}
        aria-label={accessibleLabel}
        on-click={handleClick}
      >
        {/* Optional Icon Support - Ready for future CSS or font-awesome expansion */}
        {icon && icon !== "" ? <span className={`btn-icon ${icon}`} style={{ marginRight: "6px" }}></span> : null}

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
    value: { default: "", reflect: true },
    label: { default: "Execute Action", reflect: true },
    ariaLabel: { default: "", reflect: true },
    icon: { default: "", reflect: true },
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

      if (name === "value" || name === "id" || name === "buttonId" || name === "buttonid" || name === "button-id") {
        updateState({ value: value, id: value, buttonId: value });
      } else {
        updateState({ [name]: value });
      }
    },
  },
});
