import './footer.scss'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

const Footer = (): JSX.Element => {
    const { t } = useTranslation()

    const isQuestionPage = window.location.pathname === '/question'
    const classes = cn({ 'position-relative': isQuestionPage }, 'footer')

    return (
        <footer>
            <div className={classes}>{t("Service created by")} <a className='footer-link' href="https://github.com/AlexKay28">AlexKay</a> {t("and")} <a className='footer-link' href="https://github.com/Alkhimovmv">AlkhimovMV</a>.
            </div>
        </footer>
    )
}

export default Footer