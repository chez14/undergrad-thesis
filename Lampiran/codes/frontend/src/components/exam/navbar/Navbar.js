import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Navbar from 'reactstrap/lib/Navbar';
import Nav from 'reactstrap/lib/Nav';
import NavItem from 'reactstrap/lib/NavItem';
import NavLink from 'reactstrap/lib/NavLink';
import NavbarBrand from 'reactstrap/lib/NavbarBrand';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class NavbarExam extends Component {
  render() {
    const { type, participant, onNotifShowRequested = () => { } } = this.props;

    const { notifications = [] } = participant;
    return (
      <Navbar color={((type === "inprogress") ? "info" : "warning")} light={type !== "inprogress"} dark={type === "inprogress"} expand="xs">
        <NavbarBrand href="/exam" to="/exam" tag={Link}>LabIF UNPAR</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              <FontAwesomeIcon icon={['far', 'bell']} />
            </DropdownToggle>
            <DropdownMenu right>
              {(notifications || []).map((item) => <DropdownItem key={"notification" + item._id} onClick={() => onNotifShowRequested(item)}>
                {item.title}
              </DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>

          <NavItem className="bg-dark px-2 ml-3" style={{ borderRadius: "2rem" }}>
            <NavLink className="text-light"><FontAwesomeIcon icon={['far', 'user-circle']} /> {participant.username}</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}
NavbarExam.propTypes = {
  type: PropTypes.oneOf(["inprogress", "upcoming"]),
  participant: PropTypes.object.isRequired
}

NavbarExam.defaultProps = {
  type: "inprogress"
}
export default (observer(NavbarExam));