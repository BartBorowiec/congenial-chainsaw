import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';

import style from '../scss/Login.module.scss';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isError: false,
        }
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value });
    };

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            isError: false,
        });
        const payload = {
            username: this.state.username,
            password: this.state.password,
        };
        axios.post('http://frontend-recruitment.one2tribe.pl:8080/api/authenticate', payload)
            .then(response => {
                const authToken = response.headers.authorization;

                this.props.authorize(authToken);
                this.props.history.push("/");
            }).catch(() => {
            this.setState({
                isError: true,
            })
        });

    };
    render() {
        return (
            <div>

                <form onSubmit={(e)=>this.handleSubmit(e)} className={style.loginForm}>
                    <TextField
                        id="username"
                        label="Name"
                        className={style.textField}
                        onChange={(e)=>this.handleChange(e)}
                        margin="normal"
                        value={this.state.username}
                        required
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        className={style.textField}
                        autoComplete="current-password"
                        onChange={(e)=>this.handleChange(e)}
                        margin="normal"
                        value={this.state.password}
                        required
                    />
                    <Button className={style.submitButton} type="submit">
                        Log in
                    </Button>
                    {this.state.isError && <p className={style.errorPrompt}>Invalid username/password</p>}
                </form>
            </div>
        )

    }
}
