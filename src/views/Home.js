import React from 'react';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import style from "../scss/Home.module.scss"
import axios from "axios";

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            itemList: [],
            inputValue: '',
            isGetError: false,
            isPostError: false,
        }
    }

    fetchItemList() {
        this.setState({
            isGetError: false,
        });
        axios.get('http://frontend-recruitment.one2tribe.pl:8080/api/v1/item', {
            headers: {
                Authorization:  this.props.token,
            }
        })
            .then((response) => {
                this.setState({
                    itemList: response.data,
                })
            })
            .catch(() => {
                this.setState({
                    isGetError: true,
                })
            });
    }

    componentDidMount() {
        this.fetchItemList()
    }

    handleLogout(event) {
        event.preventDefault();
        this.props.deauthorize();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            isPostError: false,
        });
        const config = {
            url: 'http://frontend-recruitment.one2tribe.pl:8080/api/v1/item',
            headers: {
                Authorization: this.props.token,
            },
            method: 'post',
            data: {
                name: this.state.inputValue,
            },
        };
        axios(config)
            .then(() => {
                this.fetchItemList();
                this.setState({
                    inputValue: '',
                })
            })
            .catch(() => {
                this.setState({
                    isPostError: true,
                })
            });
    }

    handleChange(event) {
        this.setState({
            inputValue: event.target.value,
        });
    };

    render() {
        if (!this.props.token) {
            return <Redirect to="/Login"/>
        }
        return (
            <div className={style.wrapper}>
                <Button onClick={(e) => this.handleLogout(e)} className={style.logoutButton}>Logout</Button>
                {this.state.isGetError && <p className={style.errorPrompt}>Could not fetch item list</p>}
                <List>
                    {this.state.itemList && this.state.itemList.map(
                        element => <ListItem key={element.id}><ListItemText primary={element.name}/></ListItem>
                    )}
                </List>
                <form onSubmit={(e) => this.handleSubmit(e)} className={style.newItemForm}>
                    <TextField
                        id="item"
                        label="Add new item"
                        className={style.textInput}
                        onChange={(e) => this.handleChange(e)}
                        value={this.state.inputValue}
                        required
                    />
                    <Button type="submit" className={style.addItemButton}>Add new item</Button>
                </form>
                {this.state.isPostError && <p className={style.errorPrompt}>Invalid username/password</p>}
            </div>
        )
    }
}
