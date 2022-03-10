import React from 'react';
import ReactDOM from 'react-dom';
import MainForma from'../MainForma/MainForma';
import ReactLoading from 'react-loading';
import {variables} from '../Variables.js';

class LoginBox extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { name: "", surname: "", username: "", password: "", picture: null, errors: [],
                       isCompany: false,
                       loading: false };
    }

    showValidationErr(elm, msg)
    {
        this.setState((prevState) => ( { errors: [...prevState.errors, { elm, msg }] } )); 
    }

    clearValidationErr(elm)
    {
        this.setState((prevState) => {
            let newArr = [];
            for (let err of prevState.errors)
            {
                if (elm !== err.elm)
                {
                    newArr.push(err);
                }
            }
            return {errors: newArr};
        });
    }

    onUsernameChange(e)
    {
        this.setState({ username: e.target.value });
        this.clearValidationErr("username");
    }

    onPasswordChange(e)
    {
        this.setState({ password: e.target.value });
        this.clearValidationErr("password");
    }

    submitLogin(e)
    {
        var x = true;

        if (this.state.username === "")
        {
            this.showValidationErr("username", "Username cannot be empty!");
            x = false;
        }
        if (this.state.password === "")
        {
            this.showValidationErr("password", "Password cannot be empty!");
            x = false;
        }

        if (x)
        {
            this.setState({ loading: true });

            fetch(variables.API_URL + 'Person/' + this.state.username + '/' + this.state.password)
                .then(res => res.json())
                .then(data => {
                    if (data.length !== 0)
                    {
                        if (data[0].password === this.state.password)
                        {
                            this.setState({ name: data[0].ime });
                            this.setState({ surname: data[0].prezime });
                            this.setState({ password: data[0].password });
                            this.setState({ isCompany: data[0].company });
                            this.setState({ picture: data[0].picture });
                            
                            this.setState({ loading: false });
                            ReactDOM.render(<MainForma state={this.state}/>, document.getElementById('root'));
                        }
                        else
                        {
                            this.setState({ password: "" });
                            this.showValidationErr("password", "Wrong password! Try again.");
                        }
                    }
                    else
                    {
                        this.showValidationErr("username", "Wrong username! Try again.");
                    }

                    this.setState({ loading: false });
                },(error) => {
                    this.setState({ loading: false });
                    alert(error);
                })              
        }
    }

    myFunction()
    {
        var x = document.getElementById("myInput");
        if (x.type === "password") 
        {
            x.type = "text";
        } 
        else
        {
            x.type = "password";
        }
    }

    render()
    {
        let usernameErr = null, passwordErr = null;

        for (let err of this.state.errors)
        {
            if (err.elm === "username")
            {
                usernameErr = err.msg;
            }
            if (err.elm === "password")
            {
                passwordErr = err.msg;
            }
        }

        return (
            <div className="inner-container">
                <div className="header">
                    Login
                </div>

                <div className="box">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>  
                        <input type="text" name="username" className="login-input" placeholder="Username"
                            onChange={this.onUsernameChange.bind(this)}/>
                        <small className="danger-error"> {usernameErr ? usernameErr : ""} </small>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>  
                        <div className="password">
                            <input type="password" name="password" className="login-input-password" id="myInput" placeholder="Password"
                                onChange={this.onPasswordChange.bind(this)}/>
                            <div className="pomeri">
                                <label className="switch">
                                    <input type="checkbox" name="cbxpassword" onClick={this.myFunction.bind(this)} placeholder="Cbxpassword"/>
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                        <small className="danger-error"> {passwordErr ? passwordErr : ""} </small>
                    </div>
                    
                    <div className="input-group btn"> 
                        <button type="button" className="button-4" onClick={this.submitLogin.bind(this)}>Login</button>
                        <div className={(this.state.loading ? "divLoading" : "divLoadingClose")}>
                            <ReactLoading type="spin" color="#018dff" height="32px" width="32px" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginBox;