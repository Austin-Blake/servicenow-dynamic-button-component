import { createCustomElement } from "@servicenow/ui-core";
import snabbdom from "@servicenow/ui-renderer-snabbdom";
import styles from "./styles.scss";

const view = (state, { dispatch }) => {
  const { label, disabled, visible, loading, variant } = state;

  // Handle visibility property (string or boolean)
  if (visible === false || visible === "false") {
    return null;
  }

  const handleClick = (e) => {
    e.preventDefault();

    // Block clicks if disabled or loading
    if (disabled === true || disabled === "true" || loading === true || loading === "true") {
      return;
    }

    // Emit custom event across Shadow DOM boundary
    dispatch("DYNAMIC_BUTTON_CLICKED", { timestamp: Date.now(), label: label }, { bubbles: true, composed: true });
  };

  const isBtnDisabled = disabled === true || disabled === "true" || loading === true || loading === "true";

  return (
    <div className="dynamic-button-wrapper">
      <button
        type="button"
        className={`dynamic-btn variant-${variant || "primary"} ${loading ? "is-loading" : ""}`}
        disabled={isBtnDisabled}
        on-click={handleClick}
      >
        {loading === true || loading === "true" ? "Processing..." : label || "Execute Action"}
      </button>
    </div>
  );
};

createCustomElement("x-665953-dynamic-button", {
  renderer: { type: snabbdom },
  view,
  styles,
  properties: {
    label: { default: "Execute Action" },
    disabled: { default: false },
    visible: { default: true },
    loading: { default: false },
    variant: { default: "primary" }, // 'primary', 'secondary', 'danger'
  },
});
