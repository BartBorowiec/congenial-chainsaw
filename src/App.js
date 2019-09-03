import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./views/Login";
import Home from "./views/Home";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authToken: window.sessionStorage.authToken,
        }
    }

    authorize(token) {
        window.sessionStorage.setItem('authToken', token);
        this.setState({
            authToken: token,
        });
    }

    deauthorize() {
        window.sessionStorage.removeItem('authToken');
        this.setState({
            authToken: '',
        });
    }

    render() {
        return (
            <Router>
                <div>
                    <Route
                        path="/login"
                        render={(props) => (
                            <Login
                                {...props}
                                authorize={(token) => this.authorize(token)}
                            />
                        )}
                    />
                    <Route
                        exact path="/"
                        render={(props) => (
                            <Home
                                {...props}
                                token={this.state.authToken}
                                deauthorize={ () => this.deauthorize() }
                            />
                        )}
                    />
                </div>
            </Router>  );
    }
}
