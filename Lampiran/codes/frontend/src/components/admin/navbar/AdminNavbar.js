import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { NavLink as Link, withRouter } from 'react-router-dom'

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container
} from 'reactstrap';

class AdminNavbar extends Component {
  state = {
    isOpen: false
  }

  toggle() {
    const { isOpen } = this.state;
    this.setState({ isOpen: isOpen });
  }

  componentDidMount() {
    const { adminStore, history } = this.props;
    adminStore.fetchProfile().catch(e => {
      history.push("/admin/account/login");
    })
  }

  handleLogout() {
    const { adminStore, history } = this.props;
    adminStore.userLogout().then(() => {
      history.push("/admin/account/login");
    });
  }

  render() {
    const { adminStore } = this.props;
    const { isOpen } = this.state;


    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <Container>
            <NavbarBrand href="/admin" to="/admin" tag={Link}>Oxam</NavbarBrand>
            <NavbarToggler onClick={() => this.toggle()} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink to="/admin/exam/" tag={Link}>Ujian</NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>Exam Params</DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem tag={Link} to="/admin/manage/lectures">Lectures</DropdownItem>
                    <DropdownItem tag={Link} to="/admin/manage/lectureperiods">Lecture Periods</DropdownItem>
                    <DropdownItem tag={Link} to="/admin/manage/computers">Computers</DropdownItem>
                    <DropdownItem tag={Link} to="/admin/manage/locations">Location</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Oxam Params
                </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem tag={Link} to="/admin/manage/acls">Acls</DropdownItem>
                    <DropdownItem tag={Link} to="/admin/manage/admins">Admins</DropdownItem>
                    <DropdownItem tag={Link} to="/admin/manage/iplogins">IP Login</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
              <Nav navbar>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    @{adminStore?.user?.username || "Reg"}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem tag={Link} to={"/admin/manage/admins/" + adminStore?.user?._id}>Account Setting</DropdownItem>
                    <DropdownItem onClick={this.handleLogout.bind(this)}>Logout</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default inject("adminStore")(
  withRouter(observer(AdminNavbar))
);