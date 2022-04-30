import cn from 'classnames'

import { Router, Switch, Route, Redirect } from 'react-router-dom'
import Question from '../Question/Question'
import HomePage from '../HomePage/HomePage'
import RegistrationPage from '../RegistrationPage/RegistrationPage'
import LoginPage from '../LoginPage/LoginPage'
import Header from '../Header/Header'
import OurTeam from '../OurTeam/OurTeam'
import Footer from '../Footer/Footer'

import { history } from '../helpers/history'

const CurrentPage = () => {
    const isQuestionPage = window.location.pathname === '/question'
    const classes = cn({ 'vh-100': !isQuestionPage, 'min-vh-100': isQuestionPage }, 'text-center bg-light')

    return (
        <Router history={history}>
            <div className={classes}>
                <Header/>
                <Switch>
                    <Route path='/home' component={HomePage} />
                    <Route path='/ourteam' component={OurTeam} />
                    <Route path='/question' component={Question} />
                    <Route path='/registration' component={RegistrationPage} />
                    <Route path='/login' component={LoginPage} />
                    <Redirect from='/' to='/home'/>
                </Switch>
                <Footer/>
            </div>
        </Router>
    )
}

export default CurrentPage