![image](https://cloud.githubusercontent.com/assets/2733862/25308856/f108bf4c-27c6-11e7-9f93-08af0f0eb863.png)


### Features
1. dropdown
2. search with value coming back via prop
3. navigate the list up/down with arrow up/down
4. select any item with Enter
5. select / navigate with mouse 
6. selected item is returned via prop

### Properties

1. height = pixels, just enter the number 
2. items = array of objects that must have jsx property: `[{jsx: <div>some text</div>, yourCustom: 123}, {...}]`
3. onInputChange = function to get new value of the search field
4. onSelected = function to get selected item back. It will return original item like: `{jsx: <div>some text</div>, yourCustom: 123}`

### Sample usage

```javascript
import AutoComplete from 'components/AutoComplete';

...

let items = [];

for (let index = 1; index <= 20; index++) {
  items.push({
    value: `some value ${index}`,
    jsx: <div>Item <strong>strong!</strong> {index}</div>
  });
}

...

<AutoComplete
  items={items}
  onSelected={(selected) => console.log('selected: ', selected)}
  onInputChange={(item) => console.log('item: ', item)}
/>

...

```

### It has dependency on:
1. `npm i prop-types --save` From official ReactJs docs: React.PropTypes is deprecated [link](https://facebook.github.io/react/docs/typechecking-with-proptypes.html)
2. `npm i react --save`
3. `npm i @blueprintjs/core --save`

You can easily modify and remove 3rd, but while i was using this lib while building https://www.geekystats.com/ it's there.

I needed auto complete field and blueprint doesn't have it yet. I've created my own, you can use it for whatever needed.
