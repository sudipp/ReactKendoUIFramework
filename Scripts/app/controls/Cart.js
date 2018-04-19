//import React from 'react/addons';
import React from 'react';
//import Item from './Item';

/*
 * @class Cart
 * @extends React.Component
 */
class Cart extends React.Component {

  /*
   * @method shouldComponentUpdate
   * @returns {Boolean}
   */
  shouldComponentUpdate () {
    return true;
      
    return React.addons.PureRenderMixin.shouldComponentUpdate.apply(this, arguments);
  }
	
	 constructor(props) {
        //debugger;       

        super(props);
        
        
        
        this.state = {text: '', inputText: '', mode:'view'};
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
	
	
	handleChange(e) {
        this.setState({ inputText: e.target.value });
      }

      handleSave() {
        this.setState({text: this.state.inputText, mode: 'view'});
      }

      handleEdit() {
        this.setState({mode: 'edit'});
      }
    
    renderInputField() {
    if(this.state.mode === 'view') {
      return <div>wwwww</div>;
    } else {
      return (
          <div>renderInputField
          <p>
            <input
              onChange={this.handleChange}
              value={this.state.inputText}
            />
          </p>
          </div>
      );
    }
  }
  
  renderButton() {
    if(this.state.mode === 'view') {
      return (
          <div>renderButton1
          <button onClick={this.handleEdit}>
            Edit
          </button></div>
      );
    } else {
      return (
          <div>renderButton2
          <button onClick={this.handleSave}>
            Save
          </button></div>
      );
    }
  }
	
	render () {
    return (
      <div id="grid_1">
        <p>Text: {this.state.text}</p>
            {this.renderInputField()}
            {this.renderButton()}
      </div>
    );
  }
	
	
  /*
   * @method render
   * @returns {JSX}
   */
  /*render () {
    return <div className="cart">Grid</div>;
  }*/
}

// Prop types validation
/*Cart.propTypes = {
  cart: React.PropTypes.object.isRequired,
};*/

export default Cart;
