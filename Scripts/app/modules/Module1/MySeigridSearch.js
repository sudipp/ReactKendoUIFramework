    //import React from 'react/addons';
    import React from 'react';
    import SeigridSearchTemplate from './../../controls/SeigridSearchTemplate';
    import $ from 'jquery';

    //import Item from './Item';

    /*
     * @class Cart
     * @extends React.Component
     */
    class MySeigridSearch extends SeigridSearchTemplate {

        constructor(props) {
            super(props);
            //this.state = {isToggleOn: true};

            // This binding is necessary to make `this` work in the callback
            this.handleSearchClick = this.handleSearchClick.bind(this);
			this.handleSearchCloseClick = this.handleSearchCloseClick.bind(this);
        }

        handleSearchClick = (e) => {
            alert(this.props.Seigrid.grid);
        }
		handleSearchCloseClick = (e) => {
            this.props.Seigrid.closeSearch();
        }

        /*
         * @method shouldComponentUpdate
         * @returns {Boolean}
         */
        shouldComponentUpdate(nextProps, nextState) {
            //debugger;
            return true;//React.addons.PureRenderMixin.shouldComponentUpdate.apply(this, arguments);
        }

        /*
         * @method render
         * @returns {JSX}
         */
        render() {
            return ( < div > < h1 > Search Request < /h1> <
                div > Include Archieved: < /div> <
                input type = "checkbox"
                name = "ArchievedIncluded" / >
                <
                br / >
                <
                button class = "k-button"
                id = "btnSearch"
                title = "Search"
                onClick = {
                    this.handleSearchClick
                } > Search < /button> <
                button class = "k-button"
                id = "btnCloseSearch"
                title = "Close"
                onClick = {
                    this.handleSearchCloseClick
                } > Close < /button>; <
                /div>);
                //return <div>MySeigridSearch derived from SeigridSearch Default Search Panel</div>;
            }
        }

        // Prop types validation
        /*Cart.propTypes = {
          cart: React.PropTypes.object.isRequired,
        };*/

        export default MySeigridSearch;
