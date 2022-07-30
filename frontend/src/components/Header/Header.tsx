import './header.scss'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import ReactFlagsSelect from 'react-flags-select'
import logo from '../../images/logo.png'
import { useTranslation } from 'react-i18next'
import i18n from '../../translations/i18n'
import '../../translations/i18n'

import { logout } from '../actions/auth'
import { RootState } from '../store'

const Header = (): JSX.Element => {
    const { t } = useTranslation()

    const dispatch = useDispatch()

    const [language, setLanguage] = useState(window.localStorage.getItem('i18nextLng')?.toUpperCase() || 'GB')

    const { isLoggedIn } = useSelector((state: RootState) => state.auth)

    const logOut = () => {
        dispatch(logout())
    }

    useEffect(() => {    
        i18n.changeLanguage(language.toLowerCase())
    }, [])
 
    const handleOnclick=(value: string)=>{
        setLanguage(value);
        i18n.changeLanguage(value.toLowerCase())
    }
    
    return (
        <Navbar style={{display: 'contents'}} fixed="top">
            <Container className="p-2">
                <a className='header_logo-img' href="/">
                    <img
                        src={logo}
                        alt="langflow logo"
                    />
                </a>
                <Nav className="me-auto">
                    <a className="header_logo" href="/">Langflow</a>
                </Nav>
                <ReactFlagsSelect
                    selected={language}
                    onSelect={(code: string) => handleOnclick(code)}
                    countries={["RU", "GB", "FR", "UA"]}
                    customLabels={{ RU: "RU", GB: "EN", FR: "FR", UA: "UA" }}
                    placeholder="Select Language"    
                    className="header-flags"        
                />
                <Nav className="header_nav-links">
                    <NavLink className="header_nav-link" activeClassName="header_nav-link-active" to="/home">{t("home")}</NavLink>
                    <NavLink className="header_nav-link" activeClassName="header_nav-link-active" to="/ourteam">{t("ourteam")}</NavLink>
                    {!isLoggedIn ? 
                    <>
                        <NavLink className="header_nav-link" activeClassName="header_nav-link-active" to="/login">{t("signin")}</NavLink>
                        <NavLink className="header_nav-link" activeClassName="header_nav-link-active" to="/registration">{t("signup")}</NavLink>
                    </> : 
                    <NavLink className="header_nav-link" activeClassName="header_nav-link-active" to="/login"  onClick={logOut}>{t("logout")}</NavLink>}
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Header