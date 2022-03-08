import logo from "../images/logo.svg";
import {Link} from "react-router-dom";

function Header({nameLink, route = "", onOut, email = ""}){
    return(
        <header className="header">
            <img className="header__logo" src={logo} alt="Место. Россия"/>
            <nav className="header__links">
                <p className="header__email">{email}</p>
                <Link className="header__link" to={route} onClick={onOut}>{nameLink}</Link>
            </nav>
        </header>
    );
}


export default Header;