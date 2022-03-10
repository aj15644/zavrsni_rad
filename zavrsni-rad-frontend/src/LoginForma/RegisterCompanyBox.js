import React from 'react';
import {variables} from '../Variables.js';

class RegisterCompanyBox extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { name: "", username: "", password: "", location: "", errors: [] };
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

    onNameChange(e)
    {
        this.setState({ name: e.target.value });
        this.clearValidationErr("name");
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

    onLocationChange(e)
    {
        this.setState({ location: e.target.value });
        this.clearValidationErr("location");
    }

    submitRegister(e)
    {
        var x = true;

        if (this.state.name === "")
        {
            this.showValidationErr("name", "Name cannot be empty!");
            x = false;
        }
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
        if (this.state.location === "")
        {
            this.showValidationErr("location", "Location cannot be empty!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'Company/submitRegister',{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    ime:this.state.name,
                    ime_prezime:this.state.name,
                    name:this.state.username,
                    password:this.state.password,
                    date_of_establishment:document.getElementById("dateOfEstablishmentId").value,
                    location:this.state.location
                })
            })
            .then(res => res.json())
            .then(data => {
                alert(data);
            },(error) => {
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
        let nameErr = null, usernameErr = null, passwordErr = null, locationErr = null;

        for (let err of this.state.errors)
        {
            if (err.elm === "name")
            {
                nameErr = err.msg;
            }
            if (err.elm === "username")
            {
                usernameErr = err.msg;
            }
            if (err.elm === "password")
            {
                passwordErr = err.msg;
            }
            if (err.elm === "location")
            {
                locationErr = err.msg;
            }
        }

        return (
            <div className="inner-container">
                <div className="header">
                    Register company
                </div>

                <div className="box">
                    <div className="input-group">
                        <label htmlFor="name">Company name</label>  
                        <input type="text" name="name" className="login-input" placeholder="Company Name" 
                            onChange={this.onNameChange.bind(this)}/>
                        <small className="danger-error"> {nameErr ? nameErr : ""} </small>    
                    </div>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>  
                        <input type="text" name="username" className="login-input" placeholder="Username" 
                            onChange={this.onUsernameChange.bind(this)}/>
                        <small className="danger-error"> {usernameErr ? usernameErr : ""} </small>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>  
                        <input type="password" name="password" className="login-input" id="myInput" placeholder="Password"
                            onChange={this.onPasswordChange.bind(this)}/>
                        <div className="input-group-radio">
                            <input type="checkbox" name="cbxpassword" onClick={this.myFunction.bind(this)} placeholder="Cbxpassword"/>
                            <label htmlFor="cbxlabel">Show password</label>
                        </div>
                        <small className="danger-error"> {passwordErr ? passwordErr : ""} </small>
                    </div>

                    <div className="input-group">
                        <label htmlFor="dateOfEstablishment">Date of Establishment</label>  
                        <input type="date" name="dateOfEstablishment" className="login-input" id="dateOfEstablishmentId" placeholder="dateOfEstablishment"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="name">Company location</label>  
                        <input type="text" name="location" className="login-input" placeholder="Company location" 
                            onChange={this.onLocationChange.bind(this)}/>
                        <small className="danger-error"> {locationErr ? locationErr : ""} </small>    
                    </div>

                    <div className="input-group btn">
                        <button type="button" className="button-4" onClick={this.submitRegister.bind(this)}>Register</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegisterCompanyBox;