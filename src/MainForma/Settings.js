import React from 'react';
import './MainForma.css';
import './MainFormaButton.css';
import Select from 'react-select';
import {variables} from '../Variables.js';

class Settings extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { errors: [],
                       technologies: [], selectedTech: "", boolClickTech: false,
                       allCompanies: [], selectedCompany: "", myCompany: "",
                       myTechnologies: [], myPhone: [], myEmail: [], aboutMe: "",
                       newEmail: "", newPhone: "",
                       selectedEmail: "", selectedPhone: "", boolClickEmail: false, boolClickPhone: false, 
                       showInfoLab: false,
                       allTechnologies: [], selectedNewTech: "", newTechnology: "", isAdmin: false };
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

//#region Technologies
    showTechnologies()  // backend
    {
        this.state.technologies.splice(0, this.state.technologies.length);

        fetch(variables.API_URL + 'TehnologijeIJezici')
            .then(response => response.json())
            .then(data => {
                data.forEach(el => {
                    this.state.technologies.push(el);
                })
                this.forceUpdate();
            })
    }
    
    showAllTechnologies()   // backend
    {
        // takodje vraca sve tehnologije ali za select box
        this.state.allTechnologies.splice(0, this.state.allTechnologies.length);
        var d = {
            value: null, 
            label: 'Select...'
        };
        this.state.allTechnologies.push(d);

        fetch(variables.API_URL + 'TehnologijeIJezici')
            .then(response => response.json())
            .then(data => {
                data.forEach(el => {
                    d = {
                        value: el, 
                        label: el
                    };
                    this.state.allTechnologies.push(d);
                })
                this.forceUpdate();
            })
    }

    showMyTechnologies()    // backend
    {
        this.state.myTechnologies.splice(0, this.state.myTechnologies.length);

        fetch(variables.API_URL + 'TehnologijeIJezici/' + this.props.state.username)
            .then(res => res.json())
            .then(data => {
                data.forEach(el => {
                    this.state.myTechnologies.push(el);
                })
                this.forceUpdate();
            })
    }

    isMyTinAllT(tehnologija)
    {
        for (var i = 0; i < this.state.myTechnologies.length; i++) 
            if (this.state.myTechnologies[i] === tehnologija)
                return true;

        return false;
    }

    onSelectTech(e)
    {
        if (this.state.selectedTech !== e.target.dataset.id)
        {
            this.setState({ selectedTech: e.target.dataset.id });
            if (this.state.boolClickTech === false)
                this.setState({ boolClickTech: true });
        }
        else
            this.setState({ selectedTech: "" });

        this.clearValidationErr("addtech");
    }

    addTechnologies()   // backend
    {
        var x = true;

        if (this.state.selectedTech === "")
        {
            this.showValidationErr("addtech", "You must select technology!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'TehnologijeIJezici/' + this.props.state.username,{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:this.state.selectedTech
                })
            })
            .then(res => res.json())
            .then(data => {
                this.setState({ selectedTech: "" });
                this.showAllTechnologies();
                this.showTechnologies();
                this.showMyTechnologies();
                console.log(data);
            },(error) => {
                alert(error);
            })
        }
    }

    deleteTechnologies()    // backend
    {
        var x = true;

        if (this.state.selectedTech === "")
        {
            this.showValidationErr("addtech", "You must select technology!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'TehnologijeIJezici/' + this.props.state.username,{
                method:'DELETE',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:this.state.selectedTech
                })
            })
            .then(res => res.json())
            .then(data => {
                this.setState({ selectedTech: "" });
                this.showAllTechnologies();
                this.showTechnologies();
                this.showMyTechnologies(); 
                console.log(data);
            },(error) => {
                alert(error);
            })
        }
    }

    showInformation()
    {
        if (this.state.showInfoLab === false)
            this.setState({ showInfoLab: true });
        else
            this.setState({ showInfoLab: false });
    }
//#endregion

//#region Admin Technologies
    onNewTechnologyChange(e)
    {
        this.setState({ newTechnology: e.target.value });
        this.clearValidationErr("newtech");
    }

    onSelectNewTech(e)
    {
        this.setState({ selectedNewTech: e.value });
    }

    addNewTechnology()  // backend
    {
        var x = true;

        if (this.state.newTechnology === "")
        {
            this.showValidationErr("newtech", "New technology cannot be empty!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'TehnologijeIJezici',{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:this.state.newTechnology,
                    selectedName:this.state.selectedNewTech
                })
            })
            .then(res => res.json())
            .then(data => {
                this.showAllTechnologies();
                this.showTechnologies();
                console.log(data);
            },(error) => {
                alert(error);
            })
        }
    }

    deleteTechnology()  // backend
    {
        var x = true;

        if (this.state.selectedTech === "")
        {
            this.showValidationErr("addtech", "You must select technology!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'TehnologijeIJezici',{
                method:'DELETE',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:this.state.selectedTech,
                })
            })
            .then(res => res.json())
            .then(data => {
                this.setState({ selectedTech: "" });
                this.showAllTechnologies();
                this.showTechnologies();
                console.log(data);
            },(error) => {
                alert(error);
            })
        }
    }
//#endregion

//#region Email
    showMyEmail()   // backend
    {
        this.state.myEmail.splice(0, this.state.myEmail.length);

        fetch(variables.API_URL + 'Mail/' + this.props.state.username)
            .then(res => res.json())
            .then(data => {
                data.forEach(el => {
                    this.state.myEmail.push(el);
                })
                this.forceUpdate();
            },(error) => {
                alert(error);
            })
    }

    onNewEmailChange(e)
    {
        this.setState({ newEmail: e.target.value });
        this.clearValidationErr("newemail");
    }

    addEmail()  // backend
    {
        var x = true;

        if (this.state.newEmail === "")
        {
            this.showValidationErr("newemail", "New email cannot be empty!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'Mail',{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:this.state.newEmail,
                    username:this.props.state.username
                })
            })
            .then(res => res.json())
            .then(data => {
                this.showMyEmail();
                console.log(data);
            },(error) => {
                alert(error);
            })
        }
    }

    onSelectLiEmail(e)
    {
        if (this.state.selectedEmail !== e.target.dataset.id)
        {
            this.setState({ selectedEmail: e.target.dataset.id });
            if (this.state.boolClickEmail === false)
                this.setState({ boolClickEmail: true });
        }
        else
            this.setState({ selectedEmail: "" });

        this.clearValidationErr("deleteemail");
    }

    deleteEmail()   // backend
    {
        var x = true;

        if (this.state.selectedEmail === "")
        {
            this.showValidationErr("deleteemail", "You must select email!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'Mail',{
                method:'DELETE',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:this.state.selectedEmail,
                    username:this.props.state.username
                })
            })
            .then(res => res.json())
            .then(data => {
                this.showMyEmail();
                console.log(data);
            },(error) => {
                alert(error);
            })
        }
    }
//#endregion

//#region Phone
    showMyPhone()   // backend
    {
        this.state.myPhone.splice(0, this.state.myPhone.length);

        fetch(variables.API_URL + 'Telefon/' + this.props.state.username)
            .then(res => res.json())
            .then(data => {
                data.forEach(el => {
                    this.state.myPhone.push(el);
                })
                this.forceUpdate();
            },(error) => {
                alert(error);
            })
    }

    onNewPhoneChange(e)
    {
        this.setState({ newPhone: e.target.value });
        this.clearValidationErr("newphone");
    }

    addPhone()  // backend
    {
        var x = true;

        if (this.state.newPhone === "")
        {
            this.showValidationErr("newphone", "New phone cannot be empty!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'Telefon',{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:this.state.newPhone,
                    username:this.props.state.username
                })
            })
            .then(res => res.json())
            .then(data => {
                this.showMyPhone();
                console.log(data);
            },(error) => {
                alert(error);
            })
        }
    }

    onSelectLiPhone(e)
    {
        if (this.state.selectedPhone !== e.target.dataset.id)
        {
            this.setState({ selectedPhone: e.target.dataset.id });
            if (this.state.boolClickPhone === false)
                this.setState({ boolClickPhone: true });
        }
        else
            this.setState({ selectedPhone: "" });

        this.clearValidationErr("deletephone");
    }

    deletePhone()   // backend
    {
        var x = true;

        if (this.state.selectedPhone === "")
        {
            this.showValidationErr("deletephone", "You must select phone!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'Telefon',{
                method:'DELETE',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:this.state.selectedPhone,
                    username:this.props.state.username
                })
            })
            .then(res => res.json())
            .then(data => {
                this.showMyPhone();
                console.log(data);
            },(error) => {
                alert(error);
            })
        }
    }
//#endregion

//#region Company
    showAllCompanies()  // backend
    {
        this.state.allCompanies.splice(0, this.state.allCompanies.length);
        var d = {
            value: null, 
            label: 'Select...'
        };
        this.state.allCompanies.push(d);

        fetch(variables.API_URL + 'Company')
            .then(response => response.json())
            .then(data => {
                data.forEach(el => {
                    d = {
                        value: el, 
                        label: el
                    };
                    this.state.allCompanies.push(d);
                })
                this.forceUpdate();
            })
    }

    showMyCompany() // backend
    {
        fetch(variables.API_URL + 'Company/' + this.props.state.username)
            .then(res => res.json())
            .then(data => {
                if (data.length === 0)
                    this.setState({ myCompany: "Select..." });
                else
                    this.setState({ myCompany: data });

                this.forceUpdate();
            },(error) => {
                alert(error);
            })
    }

    onSelectCompany(e)
    {
        this.setState({ selectedCompany: e.value });
    }

    addRadiU()  // backend
    {
        fetch(variables.API_URL + 'Company',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                personUsername:this.props.state.username,
                ime:this.state.selectedCompany,
                date_of:document.getElementById("dateOf").value
            })
        })
        .then(res => res.json())
        .then(data => {
            this.setState({ selectedCompany: "" });
            this.forceUpdate();
            console.log(data);
        },(error) => {
            alert(error);
        })
    }
//#endregion

//#region About
    showAbout() // backend
    {
        fetch(variables.API_URL + 'About/' + this.props.state.username)
            .then(res => res.json())
            .then(data => {
                this.setState({ aboutMe: data });
                this.forceUpdate();
            },(error) => {
                alert(error);
            })
    }

    onNewAboutChange(e)
    {
        this.setState({ aboutMe: e.target.value });
    }

    updateAbout()   // backend
    {
        fetch(variables.API_URL + 'About',{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                description:this.state.aboutMe,
                username:this.props.state.username
            })
        })
        .then(res => res.json())
        .then(data => {
            this.showAbout();
            console.log(data);
        },(error) => {
            alert(error);
        })
    }
//#endregion

    componentDidMount()
    {
        this.showTechnologies();
        this.showAllTechnologies();
        this.showMyTechnologies();
        this.showMyEmail();
        this.showMyPhone();
        this.showAllCompanies();
        this.showMyCompany();
        this.showAbout();
    }

    render() 
    {
        let newEmailErr = null, newPhoneErr = null, newTechErr = null, addNewTechErr = null;
        let deleteEmailErr = null, deletePhoneErr = null;

        for (let err of this.state.errors)
        {
            if (err.elm === "newemail")
            {
                newEmailErr = err.msg;
            }
            if (err.elm === "newphone")
            {
                newPhoneErr = err.msg;
            }
            if (err.elm === "deleteemail")
            {
                deleteEmailErr = err.msg;
            }
            if (err.elm === "deletephone")
            {
                deletePhoneErr = err.msg;
            }
            if (err.elm === "addtech")
            {
                newTechErr = err.msg;
            }
            if (err.elm === "newtech")
            {
                addNewTechErr = err.msg;
            }
        }

        return (
            <div className="main-box-container-show-person">
                <div className={(this.props.state.isCompany ? "main-box-container-small-close" : "main-box-container-small")}>
                    <h3 className="h3ShowPerson">Technologies/languages: </h3>
                    <ul className="ulTech">
                        {this.state.technologies.map((tech) => <li key={tech}
                            className={(this.isMyTinAllT(tech) ? "techDivBeli" : "techDiv") + " " + ((this.state.boolClickTech && this.state.selectedTech === tech) ? "techClicked" : "techNotClicked")}
                            onClick={this.onSelectTech.bind(this)} data-id={tech}> {tech} </li>)}
                    </ul>
                    
                    <div className="divInfo">
                        <button type="button" className="btnAdd" onClick={this.addTechnologies.bind(this)}></button>
                        <button type="button" className="btnDelete" onClick={this.deleteTechnologies.bind(this)}></button>
                        <button type="button" className="btnInformation" onClick={this.showInformation.bind(this)}></button>
                        <label className="labelInfo">{(this.state.showInfoLab ? "Contact the administrator at admins@gmail.com to add non-existent technology" : "")}</label>
                    </div>
                    <small className="danger-error"> {newTechErr ? newTechErr : ""} </small>

                    <div className={((this.props.state.username === "admin") ? "groupBox3" : "addNewTechClose")}>
                        <h3 className="h3ShowPerson">Add new technology: </h3>
                        <Select className="select" options={this.state.allTechnologies} onChange={this.onSelectNewTech.bind(this)} />
                        <input type="text" name="addtechnology" className="update-input" placeholder="Add new technology"
                                onChange={this.onNewTechnologyChange.bind(this)}/>
                        <div>
                            <button type="button" className="btnAdd" onClick={this.addNewTechnology.bind(this)}></button>
                            <button type="button" className="btnDelete" onClick={this.deleteTechnology.bind(this)}></button>
                        </div>
                        <small className="danger-error"> {addNewTechErr ? addNewTechErr : ""} </small>
                    </div>
                </div>

                <div className="main-box-container-small">
                    <h3 className="h3ShowPerson">E-mails: </h3>
                    <ul>
                        {this.state.myEmail.map((email) => <li key={email}
                                className={((this.state.boolClickEmail && this.state.selectedEmail === email) ? "personClickedSettings" : "personNotClicked")} 
                                onClick={this.onSelectLiEmail.bind(this)} data-id={email}> {email} </li>)}
                    </ul>

                    <input type="text" name="addemail" className="update-input" placeholder="Add email"
                            onChange={this.onNewEmailChange.bind(this)}/>
                    <div>
                        <button type="button" className="btnAdd" onClick={this.addEmail.bind(this)}></button>
                        <button type="button" className="btnDelete" onClick={this.deleteEmail.bind(this)}></button>
                    </div>
                    <small className="danger-error"> {newEmailErr ? newEmailErr : ""} </small>
                    <small className="danger-error"> {deleteEmailErr ? deleteEmailErr : ""} </small>
                </div>

                <div className="main-box-container-small">
                    <h3 className="h3ShowPerson">Phones: </h3>
                    <ul>
                        {this.state.myPhone.map((phone) => <li key={phone}
                                className={((this.state.boolClickPhone && this.state.selectedPhone === phone) ? "personClickedSettings" : "personNotClicked")} 
                                onClick={this.onSelectLiPhone.bind(this)} data-id={phone}> {phone} </li>)}
                    </ul>

                    <input type="text" name="addphone" className="update-input" placeholder="Add phone"
                            onChange={this.onNewPhoneChange.bind(this)}/>
                    <div>
                        <button type="button" className="btnAdd" onClick={this.addPhone.bind(this)}></button>
                        <button type="button" className="btnDelete" onClick={this.deletePhone.bind(this)}></button>
                    </div>
                    <small className="danger-error"> {newPhoneErr ? newPhoneErr : ""} </small>
                    <small className="danger-error"> {deletePhoneErr ? deletePhoneErr : ""} </small>
                </div>

                <div className={(this.props.state.isCompany ? "main-box-container-small-close" : "main-box-container-small")}>
                    <h3 className="h3ShowPerson">Company: </h3>
                    <Select className="select" options={this.state.allCompanies} onChange={this.onSelectCompany.bind(this)} placeholder={this.state.myCompany} />
                    <label className="labelDateOf">Start date:</label>
                    <input type="date" name="dateOf" className="dateOf" id="dateOf" placeholder="dateOf"/>
                    <div>
                        <button type="button" className="btnAdd" onClick={this.addRadiU.bind(this)}></button>
                    </div>
                    <small className="danger-error"> {addNewTechErr ? addNewTechErr : ""} </small>
                </div>

                <div className="main-box-container-small">
                    <h3 className="h3ShowPerson">Biography: </h3>
                    <textarea rows="4" cols="50" placeholder="Write about yourself:" onChange={this.onNewAboutChange.bind(this)}
                            maxLength="500" value={this.state.aboutMe}></textarea>
                    <div>
                        <button type="button" className="btnAdd" onClick={this.updateAbout.bind(this)}></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Settings;