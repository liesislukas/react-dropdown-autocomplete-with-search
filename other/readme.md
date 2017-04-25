countries are just array of values

```
<AutoComplete
  className={`pt-input ${this.state.countryError ? 'pt-intent-danger' : ''}`}
  ref={(countryInput) => this.countryInput = countryInput}
  items={countryOptions}
  value={this.state.country}
  onSelected={(selected) => this.handleChangeCountry(selected.value)}
  onKeyDown={this.handleKeyDown}
  onInputChange={(query) => this.setState({autocompleteSearch: query})}
/>
```
