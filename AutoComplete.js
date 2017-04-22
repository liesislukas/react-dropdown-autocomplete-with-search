import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Popover, Position} from '@blueprintjs/core';

export default class AutoComplete extends Component {

  static propTypes = {
    height: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      jsx: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
      ]).isRequired,
    })).isRequired,
    onInputChange: PropTypes.func.isRequired,
    onSelected: PropTypes.func.isRequired,
  };

  static defaultProps = {
    height: 200,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      totalItems: 0,
    };
    this.fixScroll = false;
    this.searchInput = null;
    this.selectedRowDom = null;
    this.container = null;
    this.renderContent = this.renderContent.bind(this);
    this.ensureFocus = this.ensureFocus.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.handleScrollPosition = this.handleScrollPosition.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSelectUp = this.handleSelectUp.bind(this);
    this.handleSelectDown = this.handleSelectDown.bind(this);
  }

  componentDidUpdate() {
    const totalItems = this.props.items && this.props.items.length ? this.props.items.length : 0;
    if (totalItems !== this.state.totalItems) {
      this.setState({
        totalItems,
        selectedIndex: totalItems > 0 ? 1 : 0,
      });
    }
  }

  ensureFocus() {
    if (this.searchInput) {
      this.searchInput.focus();
    }
  }

  handleScrollPosition() {
    if (!this.container || !this.selectedRowDom) {
      return;
    }
    this.fixScroll = false;
    if ((this.container.offsetHeight * 0.6) < this.selectedRowDom.offsetTop) {
      this.container.scrollTop = this.selectedRowDom.offsetTop - 150;
    }
    if (this.selectedRowDom.offsetTop < 150) {
      this.container.scrollTop = 0;
    }
  }

  handleSelectUp() {
    let selectedIndex = 0;
    if (this.state.selectedIndex === 1 && this.state.selectedIndex !== this.state.totalItems) {
      selectedIndex = this.state.totalItems;
    } else if (this.state.totalItems === 0 && this.state.selectedIndex !== 0) {
      selectedIndex = 0;
    } else {
      selectedIndex = this.state.selectedIndex - 1;
    }

    this.setState({selectedIndex});
  }

  handleSelectDown() {
    let selectedIndex = 0;

    if (this.state.selectedIndex < this.state.totalItems) {
      selectedIndex = this.state.selectedIndex + 1;
    } else if (this.state.totalItems === 0 && this.state.selectedIndex !== 0) {
      selectedIndex = 0;
    } else if (this.state.selectedIndex !== 1) {
      selectedIndex = 1;
    }

    this.setState({selectedIndex});
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.stopPropagation();
      e.preventDefault();
      this.handleSelectUp();
      this.fixScroll = true;
    } else if (e.key === 'ArrowDown') {
      e.stopPropagation();
      e.preventDefault();
      this.handleSelectDown();
      this.fixScroll = true;
    } else if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
      let value = null;
      if (this.props.items) {
        let index = 0;
        this.props.items.forEach((item) => {
          index++;
          if (index === this.state.selectedIndex) {
            value = item;
          }
        });
      }
      this.props.onSelected(value);
    }
  }

  renderItem({item, index}) {

    const {jsx} = item;

    return (
      <div
        ref={(node) => {
          if (this.state.selectedIndex === index) {
            this.selectedRowDom = node;
            if (this.fixScroll) {
              setTimeout(() => this.handleScrollPosition(), 1);
            }
          }
        }}
        style={{
          backgroundColor: index === this.state.selectedIndex ? '#3073b9' : 'inherit',
          color: index === this.state.selectedIndex ? '#fff' : 'inherit',
          borderRadius: 3,
          padding: 3,
          marginRight: 5,
        }}
        key={index}
        onClick={() => this.props.onSelected(item)}
        onMouseOver={() => this.setState({selectedIndex: index})}
      >
        {jsx}
      </div>
    );
  }

  renderContent() {

    const items = [];

    if (this.props.items) {
      let index = 0;
      this.props.items.forEach((item) => {
        index++;
        items.push(this.renderItem({item, index}));
      });
    }

    return (
      <div style={{padding: 12}}>
        <div style={{marginBottom: 6, display: 'flex', justifyContent: 'center'}}>
          <input
            className="pt-input"
            ref={(input) => this.searchInput = input}
            onKeyDown={this.handleKeyDown}
            onChange={(e) => this.props.onInputChange(e.target.value)}
          />
        </div>
        <div
          ref={(node) => this.container = node}
          style={{overflowY: 'scroll', height: this.props.height, width: 190}}
        >
          {items}
        </div>
      </div>
    );
  }

  render() {
    return (
      <Popover
        popoverDidOpen={this.ensureFocus}
        content={this.renderContent()}
        autoFocus={false}
        position={Position.BOTTOM}
      >
        <input className="pt-input"/>
      </Popover>
    );
  }
}
