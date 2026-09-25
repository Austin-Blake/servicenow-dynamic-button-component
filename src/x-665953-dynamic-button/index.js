import { createCustomElement, actionTypes } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';

const view = (state, { dispatch }) => {
    const { label, disabled, visible, loading, variant } = state;

    if (visible === false || visible === 'false') {
        return null;
    }

    const handleClick = (e) => {
        e.preventDefault();
        if (loading || disabled) return;

        // Emit composed event carrying current component state to form scripts
        dispatch('DYNAMIC_BUTTON_CLICKED', {
            timestamp: Date.now()
        });
    };

    return (
        <div className="dynamic-button-wrapper">
            <button
                type="button"
                className={`dynamic-btn variant-${variant || 'primary'} ${loading ? 'is-loading' : ''}`}
                disabled={disabled || loading}
                on-click={handleClick}
            >
                {loading ? 'Processing...' : label}
            </button>
        </div>
    );
};

createCustomElement('x-665953-dynamic-button', {
    renderer: { type: snabbdom },
    view,
    styles,
    properties: {
        label: { default: 'Click Me' },
        disabled: { default: false },
        visible: { default: true },
        loading: { default: false },
        variant: { default: 'primary' } // 'primary', 'secondary', 'danger'
    }
});