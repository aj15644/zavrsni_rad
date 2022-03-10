import React from 'react';
import './MainForma.css';
import './MainFormaButton.css';
import {variables} from '../Variables.js';

class ShowPerson extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {};
    }

    addFollow() // backend
    {
        fetch(variables.API_URL + 'Person/addFollow/' + this.props.state.username,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username:this.props.state.osoba.name
            })
        })
        .then(res => res.json())
        .then(data => {
            this.forceUpdate();
            console.log(data);
        },(error) => {
            alert(error);
        })
    }

    deleteFollow()  // backend
    {
        fetch(variables.API_URL + 'Person/deleteFollow/' + this.props.state.username,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username:this.props.state.osoba.name
            })
        })
        .then(res => res.json())
        .then(data => {
            this.forceUpdate();
            console.log(data);
        },(error) => {
            alert(error);
        })
    }

    render() 
    {
        return (
            <div className="main-box-container-show-person">   
                <div className="main-box-container-small">
                    <h3 className="h3ShowPerson">Profile: </h3>
                    <div className="Picture">
                        <div className="personProfilePicture">
                            <img src={this.props.state.photoPath + this.props.state.osoba.picture} className="profilePicture" alt=" "  />
                        </div>

                        <div className="personProfilePicture">
                            <label>{this.props.state.osoba.ime}</label>
                            <label>{this.props.state.osoba.prezime}</label>
                            <label>{this.props.state.osoba.datum_rodj}</label>
                            <label>{this.props.state.osoba.date_of_establishment}</label>
                            <label>{this.props.state.osoba.mesto_rodj}</label>
                            <label>{this.props.state.osoba.location}</label>
                            <label>{this.props.state.osoba.pol}</label>
                        </div>

                        <div className="closeRightFollow">
                            <button type="button" className="button-8" onClick={this.addFollow.bind(this)}> Follow </button>
                            <button type="button" className="button-8" onClick={this.deleteFollow.bind(this)}> Unfollow </button>
                        </div> 
                    </div>
                </div>

                <div className="main-box-container-small">
                    <h3 className="h3ShowPerson">Contact: </h3>
                    <ul className="ulAbout">
                        {this.props.state.osobaEmail.map((email) => <li key={email.name}> {email.name} </li>)}
                    </ul>
                
                    <ul className="ulAbout">
                        {this.props.state.osobaPhone.map((phone) => <li key={phone.name}> {phone.name} </li>)}
                    </ul>
                </div>
                
                <div className={(this.props.state.osoba.company ? "main-box-container-small-close" : "main-box-container-small")}>
                    <h3 className="h3ShowPerson">Technologies: </h3>
                    <ul className="ulAbout">
                        {this.props.state.osobaTech.map((tech) => <li key={tech.name}> {tech.name} </li>)}
                    </ul>
                </div>

                <div className="main-box-container-small">
                    <h3 className="h3ShowPerson">Biography: </h3>
                    <label>{this.props.state.osobaAbout.map((a) => a.description)}</label>
                </div>               
            </div>
        );
    }
}

export default ShowPerson;