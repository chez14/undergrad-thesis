import React, { Component } from 'react';
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Form from "reactstrap/lib/Form";
import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import Input from "reactstrap/lib/Input";
import Button from "reactstrap/lib/Button";
import FormText from "reactstrap/lib/FormText";
import Alert from "reactstrap/lib/Alert";

import { Link } from "react-router-dom";
import Buildinfo from '~/components/buildinfo/Buildinfo';
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";

class Login extends Component {

  state = {
    username: "",
    password: "",
    alert: null
  }

  submitHelper(e) {
    e.preventDefault();
    const { adminStore, history } = this.props;
    const { username, password } = this.state;
    adminStore.tryLogin(username, password).then(e => {
      history.push("/admin/");
    }).catch(e => {
      if (e.response) {
        this.setState({ alert: "Error: " + e.response.data.error.title + ": " + e.response.data.error.description });
      } else {
        this.setState({ alert: "Something happended, umm... idk what. Please check your connection and console.logs." });
      }
    })
  }

  handleIPLogin(e) {
    e.preventDefault();
    const { adminStore, history } = this.props;
    adminStore.tryIPLogin().then(e => {
      history.push("/admin/screen");
    }).catch(e => {
      if (e.response) {
        this.setState({ alert: "Error: " + e.response.data.error.title + ": " + e.response.data.error.description });
      } else {
        this.setState({ alert: "Something happended, umm... idk what. Please check your connection and console.logs." });
      }
    })
  }

  render() {
    const { alert } = this.state;

    return (
      <>
        <Container>
          <Row className="h-100vh align-items-center justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card>
                <CardBody>
                  <h3>Oxam Admin Login</h3>
                  <Alert color="danger" isOpen={alert !== null} toggle={e => this.setState({ alert: null })}>
                    {alert}
                  </Alert>
                  <Form onSubmit={(e) => this.submitHelper(e)}>
                    <FormGroup>
                      <Label>Admin username</Label>
                      <Input type="text" placeholder="admin, maybe." onChange={e => this.setState({ username: e.target.value })} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Password</Label>
                      <Input type="password" placeholder="Our secret words, it's only between us." onChange={e => this.setState({ password: e.target.value })} />
                      <FormText color="muted">
                        Have some difficulties, try our <Link to="/admin/account/recover">Forgot Password</Link> tool here.
                      </FormText>
                    </FormGroup>
                    <FormGroup className="text-right">
                      <Button color="secondary" type="button" onClick={this.handleIPLogin.bind(this)}>Or Login with IP</Button> &nbsp;
                      <Button color="primary">Login</Button>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
              <p className="text-muted text-center">
                <small><Buildinfo /></small>
              </p>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default inject("adminStore")(
  withRouter(
    observer(Login))
);