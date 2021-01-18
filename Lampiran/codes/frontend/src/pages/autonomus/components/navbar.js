import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap'

function AutonomusNavbar({ defaultHome = "#" }) {
    const [openMenuToogle, setopenMenuToogle] = useState(false)
    return (
        <>
            <Navbar color="dark" dark expand="md">
                <Container>
                    <NavbarBrand href={defaultHome} to={defaultHome} tag={Link}>Oxam <small>(autnomus-mode)</small></NavbarBrand>
                    <NavbarToggler onClick={() => setopenMenuToogle(!openMenuToogle)} />
                    <Collapse isOpen={openMenuToogle} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink to="/admin" tag={Link}>Admin</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default AutonomusNavbar
