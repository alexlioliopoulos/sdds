import {
  Component,
  h,
  Prop,
  State,
  Element,
  Listen,
  Host,
  Event,
  EventEmitter,
} from '@stencil/core';

@Component({
  tag: 'sdds-dropdown',
  styleUrl: 'dropdown.scss',
  shadow: true,
})
export class Dropdown {
  textInput?: HTMLInputElement;

  /** Placeholder text for dropdown with no selectedLabel item */
  @Prop() placeholder: string;

  /** Add the value of the option as string to set it as default */
  @Prop() defaultOption: string;

  /** Add the value of the option to set it as default */
  @Prop() disabled: boolean;

  /** `default`, `multiselect`, `filter`, `nested` */
  @Prop() type: string = 'default';

  /** `large` (default), `small`, `medium` */
  @Prop() size: string = 'large';

  /** Set to true to make the width following the label text length */
  @Prop() inline: boolean = false;

  /** Position of label: `no-label` (default), `inside`, `outside` */
  @Prop() labelPosition: string = 'no-label';

  /** Label text for label inside & outside */
  @Prop() label: string;

  /** Support `error` state */
  @Prop() state: string = 'default';

  /** Add helper text in the bottom of dropdown */
  @Prop() helper: string = '';

  @State() items: Array<any> = [];

  @State() open: boolean = false;

  @State() node: HTMLElement;

  @State() selectedLabel: string = '';

  @State() selectedValue: string = '';

  @State() uuid;

  @State() dropdownUniqueClass: string = '';

  @State() openUpwards: boolean = false;

  @State() dropdownMenuHeight: number = 0;

  @State() dropdownMenuSelector: HTMLElement;

  @Element() host: HTMLElement;

  componentWillLoad() {
    // If default option is set, update the default selectedLabel value
    // this.host.children is a HTMLCollection type, cannot use forEach
    if (this.defaultOption) {
      for (let i = 0; i < this.host.children.length; i++) {
        const el = this.host.children[i];
        if (el['value'] === this.defaultOption) {
          this.selectedLabel = el.textContent;
          this.selectedValue = el['value'];
          el.setAttribute('selectedLabel', 'true');
        }
      }
    }
  }

  componentDidLoad() {
    // generate UUID for unique event listener
    this.uuid = new Date().getTime() + Math.random();
  }

  @Listen('click', { target: 'document' })
  handleDocClick(ev) {
    // To stop bubble click
    ev.stopPropagation();

    const target = ev ? ev.composedPath()[0] : window.event.target[0];
    if (this.node !== undefined && this.node.contains(target)) {
      if (typeof this.textInput !== 'undefined' || this.textInput === null) {
        this.textInput.focus();
      }
      this.open = !this.open;
    } else {
      this.tabbingLabelReset();
      this.open = false;
    }
  }

  handleClick(id) {
    if (id !== this.uuid) this.open = false;
    this.dropdownMenuHeight = this.dropdownMenuSelector.offsetHeight;
    const distanceToBottom = this.host.getBoundingClientRect().top;
    const viewportHeight = window.innerHeight;
    this.openUpwards =
      distanceToBottom + this.dropdownMenuHeight + 57 > viewportHeight;
    // If summary of dropdown menu height and its distance to the bottom is more than viewport height, open menu upwards
    // Additional 57px is added as compensation for dropdown element own input/button height
    // It is added on handleClick due to possible dynamic injection of data when component is already rendered
  }

  tabbingLabelReset() {
    if (typeof this.textInput !== 'undefined' || this.textInput === null) {
      if (!this.selectedLabel && this.selectedLabel.length <= 0) {
        this.textInput.value = '';
        this.inputSearch.emit('');
      }
      if (this.selectedLabel !== this.textInput.value) {
        this.textInput.value = this.selectedLabel;
      }
    }
  }

  @Listen('selectOption')
  selectOptionHandler(event: CustomEvent<any>) {
    this.selectedLabel = event.detail.label;
    this.selectedValue = event.detail.value;
    this.tabbingLabelReset();
    this.open = false;
  }

  @Event({
    eventName: 'inputSearch',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  inputSearch: EventEmitter<any>;

  handleSearch(ev) {
    const searchTerm = ev.target.value;
    this.inputSearch.emit(searchTerm);
    this.open = true;
  }

  render() {
    return (
      <Host
        class={{
          'sdds-dropdown--open': this.open,
          'sdds-dropdown-inline': this.inline,
          'sdds-dropdown--selected': this.selectedLabel.length > 0,
          'sdds-dropdown--error': this.state === 'error',
          'sdds-dropdown--open-upwards': this.openUpwards,
          'sdds-dropdown--label-inside-position':
            this.labelPosition === 'inside',
        }}
        selected-value={this.selectedValue}
        selected-text={this.selectedLabel}
      >
        <div class={`sdds-dropdown sdds-dropdown-${this.size}`}>
          {this.labelPosition === 'outside' && this.label.length > 0 ? (
            <span class="sdds-dropdown-label-outside">{this.label}</span>
          ) : (
            ''
          )}
          <button
            class={`sdds-dropdown-toggle ${
              this.type === 'filter' ? 'is-filter' : ''
            }`}
            type="button"
            onClick={() => this.handleClick(this.uuid)}
            ref={(node) => (this.node = node)}
          >
            <div class="sdds-dropdown-label">
              {this.type === 'filter' ? (
                <input
                  ref={(inputEl) =>
                    (this.textInput = inputEl as HTMLInputElement)
                  }
                  class="sdds-dropdown-filter"
                  type="text"
                  placeholder={this.placeholder}
                  value={this.selectedLabel}
                  onInput={(event) => this.handleSearch(event)}
                  autoComplete="off"
                />
              ) : (
                <div class="sdds-dropdown-label-container">
                  {this.size !== 'small' &&
                    this.labelPosition === 'inside' &&
                    this.label.length > 0 && (
                      <span class="sdds-dropdown-label-inside">
                        {this.label}
                      </span>
                    )}
                  <span
                    class={`sdds-dropdown-label-main ${
                      (this.selectedLabel.length === 0 ||
                        (this.labelPosition === 'inside' &&
                          this.label.length > 0)) &&
                      'sdds-dropdown-placeholder'
                    }`}
                  >
                    {this.selectedLabel.length > 0 && this.selectedLabel}

                    {!this.selectedLabel &&
                      this.labelPosition !== 'inside' &&
                      this.placeholder}

                    {!this.selectedLabel &&
                      this.size === 'small' &&
                      this.labelPosition === 'inside' &&
                      this.placeholder}
                  </span>
                </div>
              )}
            </div>
            <svg
              class="sdds-dropdown-arrow"
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div
            class="sdds-dropdown-menu"
            // Need to have reference in order to calc height and distance from bottom
            ref={(dropdownMenu) => (this.dropdownMenuSelector = dropdownMenu)}
          >
            <slot />
          </div>
        </div>
        <p class="sdds-dropdown-helper">
          <svg
            class="sdds-dropdown-error-icon"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16 4C9.37 4 3.996 9.374 3.996 16.004S9.371 28.007 16 28.007c6.63 0 12.004-5.374 12.004-12.003C28.004 9.374 22.629 4 16 4ZM2 16.004c0-7.732 6.268-14 14-14s14 6.268 14 14-6.268 14-14 14-14-6.268-14-14Z"
              fill="currentColor"
            />
            <path
              d="M14.803 14.47V10h2.376v4.47l-.352 4.295h-1.672l-.352-4.295Zm-.053 5.632h2.5v2.394h-2.5v-2.394Z"
              fill="currentColor"
            />
          </svg>
          <span>{this.helper}</span>
        </p>
      </Host>
    );
  }
}
