# sdds-dropdown

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                      | Type      | Default     |
| ---------- | ---------- | ---------------------------------------------------------------- | --------- | ----------- |
| `selected` | `selected` | Selected set to true if selected                                 | `boolean` | `false`     |
| `value`    | `value`    | Value is a unique string that will be used for application logic | `string`  | `undefined` |


## Events

| Event          | Description | Type               |
| -------------- | ----------- | ------------------ |
| `selectOption` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [sdds-dropdown-filter](.)

### Graph
```mermaid
graph TD;
  sdds-dropdown-filter --> sdds-dropdown-option
  style sdds-dropdown-option fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
