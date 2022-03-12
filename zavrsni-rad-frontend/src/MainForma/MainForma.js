import React from 'react';
import ReactDOM from 'react-dom';
import LoginForma from'../LoginForma/LoginForma';
import './MainForma.css';
import './MainFormaButton.css';
import {variables} from '../Variables.js';
import Settings from'./Settings';
import ShowPerson from './ShowPerson';

class MainForma extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { isSettingsOpen: false, isProfileSettingsOpen: false, errors: [],
                       name: "", surname: "", oldPassword: "", newPassword: "", people: [], peoplePL: [], 
                       search: "", boolClickPerson: false,
                       osoba: [], osobaTech: [], osobaEmail: [], osobaPhone: [], osobaAbout: [], osobaWorksAt: "", isPersonInfoOpen: false,
                       showInfoLabSuggested: false, showInfoLabCompany: false, 
                       followPeople: [], followPeoplePL: [], follow2People: [], follow2PeoplePL: [], employee: [], employeePL: [], 
                       isFollowingOpen: true, isSuggestedOpen: false, isSearchOpen: false,
                       photoPath:variables.PHOTO_URL, photoName: this.props.state.picture,
                       username: this.props.state.username, isCompany: this.props.state.isCompany };
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

    logOut(e)
    {
        ReactDOM.render(<LoginForma />, document.getElementById('root'));
    }

    showProfileSettingsBox()
    {
        if (this.state.isProfileSettingsOpen === false)
            this.setState({ isProfileSettingsOpen: true });
        else
            this.setState({ isProfileSettingsOpen: false});
    }

//#region Settings
    showSettingsBox()
    {
        if (this.state.isSettingsOpen === false)
            this.setState({ isSettingsOpen: true });
        else
            this.closeSettingsBox();
    }

    closeSettingsBox()
    {
        this.setState({ name: "" });
        this.setState({ surname: "" });
        this.setState({ oldPassword: "" });
        this.setState({ newPassword: "" });

        this.setState({ isProfileSettingsOpen: false});
        this.setState({ isSettingsOpen: false });
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

    onOldPasswordChange(e)
    {
        this.setState({ oldPassword: e.target.value });
        this.clearValidationErr("oldpassword");
    }

    onNewPasswordChange(e)
    {
        this.setState({ newPassword: e.target.value });
        this.clearValidationErr("newpassword");
    }

    submitNameChange(e) // backend
    {
        var x = true;

        if (this.state.name === "")
        {
            this.showValidationErr("name", "New name Cannot be empty!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'Person/submitNameChange',{
                method:'PUT',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    username:this.props.state.username,
                    name:this.state.name,
                    surname:this.props.state.surname
                })
            })
            .then(res => res.json())
            .then(data => {
                this.props.state.name = data[0];
                this.forceUpdate();
                console.log(data);
            },(error) => {
                alert(error);
            })
        }
    }

    submitSurnameChange(e)  //backend
    {
        var x = true;

        if (this.state.surname === "")
        {
            this.showValidationErr("surname", "New surname Cannot be empty!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'Person/submitSurnameChange',{
                method:'PUT',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    username:this.props.state.username,
                    name:this.props.state.name,
                    surname:this.state.surname
                })
            })
            .then(res => res.json())
            .then(data => {
                this.props.state.surname = data[0];
                this.forceUpdate();
                console.log(data);
            },(error) => {
                alert(error);
            })
        }
    }

    submitPasswordChange(e) //backend
    {
        var x = true;

        if (this.state.newPassword === "")
        {
            this.showValidationErr("newpassword", "New password Cannot be empty!");
            x = false;
        }
        if (this.state.oldPassword !== this.props.state.password)
        {
            this.showValidationErr("oldpassword", "Old password not correct!");
            x = false;
        }

        if (x)
        {
            fetch(variables.API_URL + 'Person/submitPasswordChange',{
                method:'PUT',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    username:this.props.state.username,
                    password:this.state.newPassword
                })
            })
            .then(res => res.json())
            .then(data => {
                this.props.state.password = data[0];
                this.forceUpdate();
            },(error) => {
                alert(error);
            })
        }
    }
//#endregion

//#region Main
    //#region Profile Picture
    changeProfilePicture()  // backend
    {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept='image/*';

        input.onchange = _ => {
            if (input.files && input.files[0])
            {
                this.setState({ photoName: "" });
                const formData = new FormData();
                formData.append("file", input.files[0], input.files[0].name);

                fetch(variables.API_URL + 'Person/SaveFile/' + this.props.state.username + '/' + this.props.state.picture,{
                    method:'POST',
                    body:formData
                })
                .then(res => res.json())
                .then(data => {
                    // console.log(data[0]);
                    this.setState({ photoName: data[0] });
                    this.props.state.picture = data[0];
                    this.forceUpdate();
                })
            }
        };

        input.click();
    }
    //#endregion   

    //#region Show People
    showFollowPeople()  // backend
    {
        this.state.followPeople.splice(0, this.state.followPeople.length);

        fetch(variables.API_URL + 'ShowPerson/showFollowPeople/' + this.props.state.username)
            .then(res => res.json())
            .then(data => {
                data.forEach(el => {
                    if (this.props.state.username !== el.name)
                    {
                        this.state.followPeople.push(el);
                    }
                })
                this.forceUpdate();
            },(error) => {
                alert(error);
            })
    }

    showFriendFollowPeople()    // backend
    {
        this.state.follow2People.splice(0, this.state.follow2People.length);
        this.state.follow2PeoplePL.splice(0, this.state.follow2PeoplePL.length);

        fetch(variables.API_URL + 'ShowPerson/showFriendFollowPeople/' + this.props.state.username)
            .then(res => res.json())
            .then(data => {
                data.forEach(el => {
                    if (this.props.state.username !== el.name)
                    {
                        this.state.follow2PeoplePL.push(el);
                    }
                })

                this.state.follow2PeoplePL.forEach(element => {

                    if (this.state.follow2People.length === 0)
                        this.state.follow2People.push(element);

                    for (var i = 0; i < this.state.follow2People.length; i++)
                    {
                        var y = false;
                        if (this.state.follow2People[i].name !== element.name)
                            y = true;
                        else
                            break;
                    }

                    if (y)
                        this.state.follow2People.push(element);
                });

                this.forceUpdate();
            },(error) => {
                alert(error);
            })
    }

    showEmployee()  // backend
    {
        this.state.employee.splice(0, this.state.employee.length);
        this.state.employeePL.splice(0, this.state.employeePL.length);

        fetch(variables.API_URL + 'ShowPerson/showEmployee/' + this.props.state.username)
            .then(res => res.json())
            .then(data => {
                data.forEach(el => {
                    if (this.props.state.username !== el.name)
                    {
                        this.state.employeePL.push(el);
                    }
                })

                this.state.employeePL.forEach(element => {

                    if (this.state.employee.length === 0)
                        this.state.employee.push(element);

                    for (var i = 0; i < this.state.employee.length; i++)
                    {
                        var y = false;
                        if (this.state.employee[i].name !== element.name)
                            y = true;
                        else
                            break;
                    }

                    if (y)
                        this.state.employee.push(element);
                });

                this.forceUpdate();
            },(error) => {
                alert(error);
            })
    }

    showPeople()    // backend
    { 
        this.state.people.splice(0, this.state.people.length);

        fetch(variables.API_URL + 'ShowPerson/showPeople/' + this.props.state.username)
            .then(res => res.json())
            .then(data => {
                data.forEach(el => {
                    if (this.props.state.username !== el.name)
                    {
                        this.state.people.push(el);
                    }
                })
                this.forceUpdate();
            },(error) => {
                alert(error);
            })
    }
    //#endregion

    //#region Search
    onSearchChange(e)
    {
        this.setState({ search: e.target.value });
    }

    findPeople()    // backend
    {
        var x = true;

        if (this.state.search === "")
        {
            this.showFollowPeople();
            this.showFriendFollowPeople();
            this.showEmployee();
            this.showPeople();
            x = false;
        }

        if (x)
        {
            if (this.state.isFollowingOpen)
            {
                this.state.followPeople.splice(0, this.state.followPeople.length);
                this.state.followPeoplePL.splice(0, this.state.followPeoplePL.length);

                fetch(variables.API_URL + 'findPeople/findPeople1/' + this.props.state.username + '/' + this.state.search)
                    .then(res => res.json())
                    .then(data => {
                        data.forEach(el => {
                            if (this.props.state.username !== el.name)
                            {
                                this.state.followPeoplePL.push(el);
                            }
                        })
        
                        this.state.followPeoplePL.forEach(element => {

                            if (this.state.followPeople.length === 0)
                                this.state.followPeople.push(element);

                            for (var i = 0; i < this.state.followPeople.length; i++)
                            {
                                var y = false;
                                if (this.state.followPeople[i].name !== element.name)
                                    y = true;
                                else
                                    break;
                            }

                            if (y)
                                this.state.followPeople.push(element);
                        });
        
                        this.forceUpdate();
                    },(error) => {
                        alert(error);
                    })
            }

            if (this.state.isSearchOpen)
            {
                this.state.people.splice(0, this.state.people.length);
                this.state.peoplePL.splice(0, this.state.peoplePL.length);
               
                fetch(variables.API_URL + 'findPeople/findPeople2/' + this.props.state.username + '/' + this.state.search)
                    .then(res => res.json())
                    .then(data => {
                        data.forEach(el => {
                            if (this.props.state.username !== el.name)
                            {
                                this.state.peoplePL.push(el);
                            }
                        })
        
                        this.state.peoplePL.forEach(element => {

                            if (this.state.people.length === 0)
                                this.state.people.push(element);

                            for (var i = 0; i < this.state.people.length; i++)
                            {
                                var y = false;
                                if (this.state.people[i].name !== element.name)
                                    y = true;
                                else
                                    break;
                            }

                            if (y)
                                this.state.people.push(element);
                        });
        
                        this.forceUpdate();
                    },(error) => {
                        alert(error);
                    })
            }

            if (this.state.isSuggestedOpen)
            {
                this.state.follow2People.splice(0, this.state.follow2People.length);
                this.state.follow2PeoplePL.splice(0, this.state.follow2PeoplePL.length);

                this.state.employee.splice(0, this.state.employee.length);
                this.state.employeePL.splice(0, this.state.employeePL.length);
               
                fetch(variables.API_URL + 'findPeople/findPeople3/' + this.props.state.username + '/' + this.state.search)
                    .then(res => res.json())
                    .then(data => {
                        data.forEach(el => {
                            if (this.props.state.username !== el.name)
                            {
                                this.state.follow2PeoplePL.push(el);
                            }
                        })
        
                        this.state.follow2PeoplePL.forEach(element => {

                            if (this.state.follow2People.length === 0)
                                this.state.follow2People.push(element);

                            for (var i = 0; i < this.state.follow2People.length; i++)
                            {
                                var y = false;
                                if (this.state.follow2People[i].name !== element.name)
                                    y = true;
                                else
                                    break;
                            }

                            if (y)
                                this.state.follow2People.push(element);
                        });
        
                        this.forceUpdate();
                    },(error) => {
                        alert(error);
                    })

                fetch(variables.API_URL + 'findPeople/findPeople4/' + this.props.state.username + '/' + this.state.search)
                    .then(res => res.json())
                    .then(data => {
                        data.forEach(el => {
                            if (this.props.state.username !== el.name)
                            {
                                this.state.employeePL.push(el);
                            }
                        })
        
                        this.state.employeePL.forEach(element => {

                            if (this.state.employee.length === 0)
                                this.state.employee.push(element);

                            for (var i = 0; i < this.state.employee.length; i++)
                            {
                                var y = false;
                                if (this.state.employee[i].name !== element.name)
                                    y = true;
                                else
                                    break;
                            }

                            if (y)
                                this.state.employee.push(element);
                        });
        
                        this.forceUpdate();
                    },(error) => {
                        alert(error);
                    })                  
            }
        }
    }

    showFollowingBox()
    {
        if (this.state.isFollowingOpen === false)
        {
            this.setState({ isFollowingOpen: true });
            this.setState({ isSuggestedOpen: false });
            this.setState({ isSearchOpen: false });
        }
    }

    showSuggestedBox()
    {
        if (this.state.isSuggestedOpen === false)
        {
            this.setState({ isFollowingOpen: false });
            this.setState({ isSuggestedOpen: true });
            this.setState({ isSearchOpen: false });
        }
    }

    showSearchBox()
    {
        if (this.state.isSearchOpen === false)
        {
            this.setState({ isFollowingOpen: false });
            this.setState({ isSuggestedOpen: false });
            this.setState({ isSearchOpen: true });
        }
    }

    showInformationSuggested()
    {
        if (this.state.showInfoLabSuggested === false)
            this.setState({ showInfoLabSuggested: true });
        else
            this.setState({ showInfoLabSuggested: false });
    }

    showInformationCompany()
    {
        if (this.state.showInfoLabCompany === false)
            this.setState({ showInfoLabCompany: true });
        else
            this.setState({ showInfoLabCompany: false });
    }
    //#endregion

    //#region Show person
    showPerson(e)   // backend
    {
        var xyz = true;

        if (this.state.boolClickPerson === false)
            this.setState({ boolClickPerson: true });
        
        if (this.state.isPersonInfoOpen === false)
            this.setState({ isPersonInfoOpen: true });
        else
        {
            xyz = false;
            this.setState({ isPersonInfoOpen: false});
            this.showFollowPeople();
            this.showPeople();
        }

        if (xyz)
        {
            this.state.osobaTech.splice(0, this.state.osobaTech.length);
            this.state.osobaEmail.splice(0, this.state.osobaEmail.length);
            this.state.osobaPhone.splice(0, this.state.osobaPhone.length);
            this.state.osobaAbout.splice(0, this.state.osobaAbout.length);

            fetch(variables.API_URL + 'ShowPerson/showPerson/' + e.target.dataset.id)
                .then(res => res.json())
                .then(data => {
                    this.setState({ osoba: data });
                    this.setState({ osobaTech: data.tehnologijeIJezici });
                    this.setState({ osobaEmail: data.mail });
                    this.setState({ osobaPhone: data.telefon });
                    this.setState({ osobaAbout: data.about });
                    this.setState({ osobaWorksAt: data.worksAt });
                    this.forceUpdate();
                },(error) => {
                    alert(error);
                })                                                               
        }
    }
    //#endregion
//#endregion

    componentDidMount()
    {
        this.showFollowPeople();
        this.showFriendFollowPeople();
        this.showEmployee();
        this.showPeople();
    }

    render()
    {
        let nameErr = null, surnameErr = null, oldPasswordErr = null, newPasswordErr = null;

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
            if (err.elm === "oldpassword")
            {
                oldPasswordErr = err.msg;
            }
            if (err.elm === "newpassword")
            {
                newPasswordErr = err.msg;
            }
        }

        return (
            <div className="main-inner-container">
                <div className="left-col">
                    {this.state.isSettingsOpen && <div className="settingsOpen">
                        <div className="tabs">
                            <div className="tab">
                                <input type="checkbox" id="chck1" className="inputCheckbox" onClick={this.showProfileSettingsBox.bind(this)}/>
                                <label className="tab-label2" htmlFor="chck1"> My profile </label>
                            </div>

                            <div className="tab">
                                <input type="checkbox" id="chck2" className="inputCheckbox"/>
                                <label className="tab-label" htmlFor="chck2"> Change name </label>
                                <div className="tab-content">
                                    <input type="text" name="name" className="update-input" placeholder="New name" 
                                        onChange={this.onNameChange.bind(this)}/>
                                    <button type="button" className="button-7" onClick={this.submitNameChange.bind(this)}> Change </button>
                                    <small className="danger-error"> {nameErr ? nameErr : ""} </small>
                                </div>
                            </div>

                            {!this.props.state.isCompany && <div className="tab">
                                <input type="checkbox" id="chck3" className="inputCheckbox"/>
                                <label className="tab-label" htmlFor="chck3"> Change surname </label>
                                <div className="tab-content">
                                    <input type="text" name="surname" className="update-input" placeholder="New surname"
                                        onChange={this.onSurnameChange.bind(this)}/>
                                    <button type="button" className="button-7" onClick={this.submitSurnameChange.bind(this)}> Change </button>
                                    <small className="danger-error"> {surnameErr ? surnameErr : ""} </small>
                                </div>
                            </div>}

                            <div className="tab">
                                <input type="checkbox" id="chck4" className="inputCheckbox"/>
                                <label className="tab-label" htmlFor="chck4"> Change password </label>
                                <div className="tab-content">
                                    <input type="text" name="oldpassword" className="update-input" placeholder="Old password"
                                        onChange={this.onOldPasswordChange.bind(this)} />
                                    <input type="text" name="new" className="update-input" placeholder="New password"
                                        onChange={this.onNewPasswordChange.bind(this)} />
                                    <button type="button" className="button-7" onClick={this.submitPasswordChange.bind(this)}> Change </button>
                                    <small className="danger-error"> {oldPasswordErr ? oldPasswordErr : ""} </small>
                                    <small className="danger-error"> {newPasswordErr ? newPasswordErr : ""} </small>
                                </div>
                            </div>

                            <div className="tab">
                                <input type="checkbox" id="chck5" className="inputCheckbox" onClick={this.closeSettingsBox.bind(this)}/>
                                <label className="tab-label2" htmlFor="chck5"> Close </label>
                            </div>
                        </div>
                    </div>}
                </div>

                <div className="main-col">
                    <div className="main-col-header">
                        <button type="button" className={this.state.isPersonInfoOpen ? "btnBack" : "btnBack btnBackHidden"} onClick={this.showPerson.bind(this)}></button>
                        <div className="profilePictureDiv">
                            <img src={this.state.photoPath + this.state.photoName} className="profilePicture" alt="" onClick={(this.changeProfilePicture.bind(this))}/>
                        </div>
                        
                        <div className="boxHeader">
                            <h1 className="h1Header"> 
                                {this.props.state.name} {this.props.state.surname} 
                            </h1>
                            <h1 className="boxHeader2">
                                <button type="button" className="btnSettings" onClick={this.showSettingsBox.bind(this)}></button>
                                <button type="button" className="btnLogout" onClick={this.logOut.bind(this)}></button>
                            </h1>
                        </div>
                    </div>

                    <div className="main-col-center">
                        <div className={((this.state.isProfileSettingsOpen || this.state.isPersonInfoOpen) ? "main-box-container-close" : "main-box-container main-box-container-2")}>
                            <div className="main-box-c2">
                                <input type="text" className="update-input search" placeholder="E.g. Neo4j, React, NoSQL..." onChange={this.onSearchChange.bind(this)}/>
                                <button type="button" className="btnSearch" onClick={this.findPeople.bind(this)}></button>
                            </div>

                            <ul className="ulTabNavigation">
                                <li className={(this.state.isFollowingOpen ? "liTabNavigation liTN2 liTabNavigationF" : "liTabNavigation liTN2")} onClick={(this.showFollowingBox.bind(this))}>Following</li>
                                <li className={(this.state.isSuggestedOpen ? "liTabNavigation liTN2 liTabNavigationS" : "liTabNavigation liTN2")} onClick={(this.showSuggestedBox.bind(this))}>Suggested</li>
                                <li className={(this.state.isSearchOpen ? "liTabNavigation liTN2 liTabNavigationO" : "liTabNavigation liTN2")} onClick={(this.showSearchBox.bind(this))}>Search</li>
                            </ul>

                            <div className={(this.state.isFollowingOpen ? "showFolloingPerson" : "showFollowingPersonClose")}> 
                                <ul className="ulPerson">
                                    {this.state.followPeople.map((followPerson) => <li key={followPerson.name} 
                                            className={(followPerson.company ? "companyDiv" : "personDiv") + " " + ((this.state.boolClickPerson && this.state.selectedPerson === followPerson.name) ? "personClicked" : "personNotClicked")} 
                                            onClick={this.showPerson.bind(this)} data-id={followPerson.name}> {followPerson.ime + " " + (followPerson.company ? "" : followPerson.prezime)} </li>)}
                                </ul>
                            </div>

                            <div className={(this.state.isSuggestedOpen ? "showFolloingPerson" : "showFollowingPersonClose")}>
                                <div className="divInfo">
                                    <button type="button" className="btnInformation" onClick={this.showInformationSuggested.bind(this)}></button>
                                    <label className="labelInfo">{(this.state.showInfoLabSuggested ? "Friends of your friends" : "")}</label>
                                </div>
                                <ul className="ulPerson">
                                    {this.state.follow2People.map((follow2Person) => <li key={follow2Person.name} 
                                            className={(follow2Person.company ? "companyDiv" : "personDiv") + " " + ((this.state.boolClickPerson && this.state.selectedPerson === follow2Person.name) ? "personClicked" : "personNotClicked")} 
                                            onClick={this.showPerson.bind(this)} data-id={follow2Person.name}> {follow2Person.ime + " " + (follow2Person.company ? "" : follow2Person.prezime)} </li>)}
                                </ul>
                                <div className="groupBox2"></div>
                                <div className="divInfo">
                                    <button type="button" className="btnInformation" onClick={this.showInformationCompany.bind(this)}></button>
                                    <label className="labelInfo">{(this.state.showInfoLabCompany ? "Employees in companies that you follow" : "")}</label>
                                </div>
                                <ul className="ulPerson">
                                    {this.state.employee.map((worker) => <li key={worker.name} 
                                            className={(worker.company ? "companyDiv" : "personDiv") + " " + ((this.state.boolClickPerson && this.state.selectedPerson === worker.name) ? "personClicked" : "personNotClicked")} 
                                            onClick={this.showPerson.bind(this)} data-id={worker.name}> {worker.ime + " " + (worker.company ? "" : worker.prezime)} </li>)}
                                </ul>
                            </div>

                            <div className={(this.state.isSearchOpen ? "showFolloingPerson" : "showFollowingPersonClose")}>
                                <ul className="ulPerson">
                                    {this.state.people.map((person) => <li key={person.name} 
                                            className={(person.company ? "companyDiv" : "personDiv") + " " + ((this.state.boolClickPerson && this.state.selectedPerson === person.name) ? "personClicked" : "personNotClicked")} 
                                            onClick={this.showPerson.bind(this)} data-id={person.name}> {person.ime + " " + (person.company ? "" : person.prezime)} </li>)}
                                </ul>
                            </div>
                        </div>


                        {this.state.isProfileSettingsOpen && <Settings state={this.state}/>}


                        {this.state.isPersonInfoOpen && <ShowPerson state={this.state}/>}
                    </div>
                </div>
                
                <div className="right-col"></div>
            </div>
        );
    }
}

export default MainForma;