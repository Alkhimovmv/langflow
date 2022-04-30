import './footer.scss'

import cn from 'classnames'

const Footer = (): JSX.Element => {
    const isQuestionPage = window.location.pathname === '/question'
    const classes = cn({ 'position-relative': isQuestionPage }, 'footer')

    return (
        <footer>
            <div className={classes}>Service created by <a className='footer-link' href="https://github.com/AlexKay28">AlexKay</a> and <a className='footer-link' href="https://github.com/Alkhimovmv">AlkhimovMV</a>.
            </div>
        </footer>
    )
}

export default Footer