//import React from 'react/addons';
import React from 'react';
import PropTypes from 'prop-types';
import Seigrid from './Seigrid';
//import Item from './Item';

/*
 * @class Cart
 * @extends React.Component
 */
class SeigridSearchTemplate extends React.Component {
    
    constructor(props) {
        super(props);

        //debugger;

        //this.state = {
        //    searchHtml : { __html: "<div>search content</div>" }
        //};

        //storing properties
        //var that=this;
        //debugger;
        
        //alert(props.grid.options.id);
    }
    
  /*
   * @method shouldComponentUpdate
   * @returns {Boolean}
   */
  shouldComponentUpdate () {
    return React.addons.PureRenderMixin.shouldComponentUpdate.apply(this, arguments);
  }

  /*
   * @method render
   * @returns {JSX}
   */
  render () {
    return <div>Default Search Panel -  must be overwritten by appps</div>;
  }
}

/*SeigridSearch.propTypes = {
    grid: PropTypes.element
}*/

// Prop types validation
/*Cart.propTypes = {
  cart: React.PropTypes.object.isRequired,
};*/

export default SeigridSearchTemplate;
