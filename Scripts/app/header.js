import React from 'react'
import { Link } from 'react-router-dom'
import AppConfig from 'AppConfig';

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
    <div className="navbar navbar-default navbar-fixed-top" id="eQuoteNavPanel">
        <div className="row">
            <div className="col-md-8">
                <div className="navbar-brand">
                    Place logo here
                </div> 
            </div>
            <div className="col-md-4" >
                <div className="nav navbar-nav navbar-right">
                    <a href="/">
                        <span className="glyphicon glyphicon-home"></span>
                    </a>
                    <span className="spacer" ></span>
                    <span className="glyphicon glyphicon-user" ></span>
                    <span className="spacer" ></span>
                    <div className="btn-group" >
                        <span className="usrInfo" data-toggle="dropdown" href="#" title="">{AppConfig.LoggedInUserId}</span>
    
                        <ul className="dropdown-menu dropdown-sys-menu">
                            <li>
                                <Link to="/vininfo" >Switch back to {AppConfig.LoggedInUserId}</Link>
                            </li>
                            <li><Link to="/mailoutreach" >Backup Role, UserName</Link></li>
                        </ul>
    
                     </div>
                </div>
            </div>
        </div>

        <div className="row sysinfo-pane">
            <div className="col-md-8">
                <div id="sys-message" className="sys-message">
                    <span className="k-icon k-i-note" ></span>
                    <div className="k-errormessage">
                        message panel
                    </div>
                </div>
                <div id="sys-message-expanded" className="sys-message-expanded">
                    <span className="k-icon k-i-note" ></span>
                    <div className="k-errormessage">
                        message panel expanded
                    </div>
                </div>
            </div>
    
            <div className="col-md-5 pull-right">
                <div className="navbar-right sys-menu" >                   
    
                    <div className="k-menuBoxDiv">
                        <div className="btn menuDropdown" aria-label="Left Align" data-toggle="dropdown" title="Vehicle Info">
                            <span className="glyphicon glyphicon-th-list"></span>
                        </div>
                        <ul className="dropdown-menu dropdown-sys-menu">
                            <li>
                                <Link to="/vininfo" >Vehicle Info</Link>
                            </li>
                            <li><Link to="/mailoutreach" >Mail outreach</Link></li>
                            <li>
                                <Link to="jobhistory" >Data Load History</Link>
                            </li>
                        </ul>
                    </div>                  
                    <div className="k-menuBoxDiv">                            
                        <Link to='/page1' title="page1"><span className="mnu-glyphicon glyphicon glyphicon-envelope" ></span></Link>     
                    </div>
                    <div className="k-menuBoxDiv">
                        <Link to='/createnote' title="Create Note"><span className="mnu-glyphicon glyphicon glyphicon-envelope" ></span></Link>     
                    </div>
    
                </div>
            </div>
    
        </div>
    </div>

)

//export default Header;
module.exports = {
  //Title,
  Header
};