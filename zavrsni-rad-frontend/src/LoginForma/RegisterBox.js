import React from 'react';
import {variables} from '../Variables.js';

class RegisterBox extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { name: "", surname: "", username: "", password: "", birthdayplace: "", gender: "", errors: [] };
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

    onSurnameChange(e)
    {
        this.setState({ surname: e.target.value });
        this.clearValidationErr("surname");
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

    onBirthdayplaceChange(e)
    {
        this.setState({ birthdayplace: e.target.value });
        this.clearValidationErr("birthdayplace");
    }

    onGenderChange(e)
    {
        this.setState({ gender: e.target.value });
        this.clearValidationErr("gender");
    }

    submitRegister(e)
    {
        var x = true;

        if (this.state.name === "")
        {
            this.showValidationErr("name", "Name cannot be empty!");
            x = false;
        }
        if (this.state.surname === "")
        {
            this.showValidationErr("surname", "Surname cannot be empty!");
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
        if (this.state.birthdayplace === "")
        {
            this.showValidationErr("birthdayplace", "Birthday place cannot be empty!");
            x = false;
        }
        if (this.state.gender === "")
        {
            this.showValidationErr("gender", "Gender cannot be empty!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'Person/submitRegister',{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    username:this.state.username,
                    password:this.state.password,
                    name:this.state.name,
                    surname:this.state.surname,
                    ime_prezime:this.state.name + " " + this.state.surname,
                    mesto_rodj:this.state.birthdayplace,
                    datum_rodj:document.getElementById("dateId").value,
                    pol:this.state.gender
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
        let nameErr = null, surnameErr = null, usernameErr = null, passwordErr = null, birthdayplaceErr = null, genderErr = null;

        for (let err of this.state.errors)
        {
            if (err.elm === "name")
            {
                nameErr = err.msg;
            }
            if (err.elm === "surname")
            {
                surnameErr = err.msg;
            }
            if (err.elm === "username")
            {
                usernameErr = err.msg;
            }
            if (err.elm === "password")
            {
                passwordErr = err.msg;
            }
            if (err.elm === "birthdayplace")
            {
                birthdayplaceErr = err.msg;
            }
            if (err.elm === "gender")
            {
                genderErr = err.msg;
            }
        }

        return (
            <div className="inner-container">
                <div className="header">
                    Register
                </div>

                <div className="box">
                    <div className="name-surname">
                        <div className="input-group">
                            <label htmlFor="name">Name</label>  
                            <input type="text" name="name" className="login-input-ns" placeholder="Name" 
                                onChange={this.onNameChange.bind(this)}/>
                            <small className="danger-error"> {nameErr ? nameErr : ""} </small>
                        </div>

                        <div className="input-group">
                            <label htmlFor="surname">Surname</label>  
                            <input type="text" name="surname" className="login-input-ns" placeholder="Surname" 
                                onChange={this.onSurnameChange.bind(this)}/>
                            <small className="danger-error"> {surnameErr ? surnameErr : ""} </small>
                        </div>
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
                        <label htmlFor="birthday">Birthday</label>  
                        <input type="date" name="birthday" className="login-input" id="dateId" placeholder="Birthday"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="birthdayPlace">Birthday place</label>  
                        <input type="text" name="birthdayPlace" className="login-input" placeholder="Birthday place"
                            onChange={this.onBirthdayplaceChange.bind(this)}/>
                        <small className="danger-error"> {birthdayplaceErr ? birthdayplaceErr : ""} </small>
                    </div>

                    <div className="input-group">
                        <label htmlFor="genderlab">Gender</label>  
                        <div className="input-group-radio">
                            <div className="radio-input">
                                <input type="radio" 
                                    name="gender" 
                                    id="polId" 
                                    placeholder="Gender" 
                                    value="M"
                                    onChange={this.onGenderChange.bind(this)}/>
                                <label htmlFor="M"> Male </label>
                            
                                <input type="radio" 
                                    name="gender" 
                                    id="polId" 
                                    placeholder="Gender" 
                                    value="Z"
                                    onChange={this.onGenderChange.bind(this)}/>
                                <label htmlFor="Z"> Female </label>
                            </div>
                        </div>
                        <small className="danger-error"> {genderErr ? genderErr : ""} </small>
                    </div>
                    
                    <div className="input-group btn">
                        <button type="button" className="button-4" onClick={this.submitRegister.bind(this)}>Register</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegisterBox;