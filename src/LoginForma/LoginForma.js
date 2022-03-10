import React from 'react';
import App from '../App';
import LoginBox from './LoginBox';
import RegisterBox from './RegisterBox';
import RegisterCompanyBox from './RegisterCompanyBox';

class LoginForma extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { isLoginOpen: true, isRegisterOpen: false, isRegisterCompanyOpen: false };
    }

    showLoginBox()
    {
        this.setState({ isLoginOpen: true, isRegisterOpen: false, isRegisterCompanyOpen: false });
    }

    showRegisterBox()
    {
        this.setState({ isLoginOpen: false, isRegisterOpen: true, isRegisterCompanyOpen: false });
    }

    showRegisterCompanyBox()
    {
        this.setState({ isLoginOpen: false, isRegisterOpen: false, isRegisterCompanyOpen: true });
    }

    render() 
    {
        return (
            <div className="pozadina">
                <div className="root-container">
                    <div className="box-controller">
                        <div className={"controller " + (this.state.isLoginOpen ? "selected-controller" : "")} 
                            onClick={this.showLoginBox.bind(this)}>
                            Login
                        </div>
                        <div className={"controller " + (this.state.isRegisterOpen ? "selected-controller" : "")}
                            onClick={this.showRegisterBox.bind(this)}>
                            Register
                        </div>
                        <div className={"controller " + (this.state.isRegisterCompanyOpen ? "selected-controller" : "")}
                            onClick={this.showRegisterCompanyBox.bind(this)}>
                            Company
                        </div>
                    </div>

                    <div className="box-container">
                        {this.state.isLoginOpen && <LoginBox/>}
                        {this.state.isRegisterOpen && <RegisterBox/>}
                        {this.state.isRegisterCompanyOpen && <RegisterCompanyBox/>}
                    </div>

                    <footer>
                        {<App/>}
                    </footer>
                </div>
            </div>
        );
    }
}

export default LoginForma;