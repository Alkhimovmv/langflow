import './answer.scss'

import { useEffect, useRef, useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next'

export type TAnswerData = {
  answer?: string,
  user_answer?: string,
  score?: string,
  question?: string
}

export type TAnswerProps = {
  answerData: TAnswerData
}

const usePrevious = <T extends unknown>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const useHasChanged= (val: TAnswerData) => {
  const prevVal = usePrevious(val)
  return prevVal !== val
}

function isEmpty(obj?: TAnswerData) {
  for (let key in obj) {
    return false;
  }
  return true;
}

function threshold(score: number) {
  return score <= 0.5 ? 'error' : score > 0.5 && score <= 0.75 ? 'warning' : 'success'
}

const Answer = (props: TAnswerProps) => {
  const { t } = useTranslation()

  const prevProps = usePrevious(props.answerData)
  const hasChangedPrevProps = useHasChanged(props.answerData)
  const [thirdPrevProps, setThirdPrevProps] = useState<TAnswerData[]>([])
  const [secondPrevProps, setSecondPrevProps] = useState<TAnswerData>({})
  const [firstPrevProps, setFirstPrevProps] = useState<TAnswerData>({})

  let color: "error" | "warning" | "success" | "inherit" | "primary" | "secondary" | "info" | undefined
  let textColor: string
  let icon
  
  useEffect(() => {    
    if (hasChangedPrevProps) {
      !isEmpty(secondPrevProps) && thirdPrevProps.unshift(secondPrevProps)
      firstPrevProps && setSecondPrevProps(firstPrevProps)
      prevProps && setFirstPrevProps(prevProps)
    }
  }, [hasChangedPrevProps])

  const renderTable = (prevProps: TAnswerData): JSX.Element => {
    switch (threshold(Number(prevProps.score))) {
      case 'error':
        icon = <img src="https://img.icons8.com/ios-filled/40/73738D/delete-sign--v1.png"/>
        break
      case 'warning':
        icon = <img src="https://img.icons8.com/material/40/73738D/exclamation-mark.png"/>
        break
      case 'success':
        icon = <img src="https://img.icons8.com/external-becris-lineal-becris/40/73738D/external-check-mintab-for-ios-becris-lineal-becris-1.png"/>
        break
    }
    return (
      <>
        <table className="prev-table">
          <tbody>
          <tr>
            <td className="table-header"></td>
            <td className="table-header"></td>
          </tr>
          <tr>
            <td rowSpan={3} style={{paddingRight: '4px'}}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress size={95} value={Number(prevProps.score)*100} variant="determinate" color="inherit" style={{backgroundColor: '#F5F4F4', borderRadius: '50%', opacity: 0.5}} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h4"
                    component="div"
                    color="text.secondary"
                  >{prevProps.score}</Typography>
                </Box>
              </Box>
            </td>
            <td className="table-text_block">
              <div className="table-text table-text_question">{prevProps.question}</div>
              <div className="table-text table-text_correct-answer">{prevProps.answer}</div>
            </td>
          </tr>
          <tr>
            <td className="table-text table-text_answer">{icon} {prevProps.user_answer}</td>
          </tr>
          </tbody>
        </table> 
        <div className="table_line"></div>
      </>
    )
  }
  
  const renderPrevProps = (): JSX.Element => {
    return (
      <>
        <div className="first-table">
          {!isEmpty(firstPrevProps) ?
          renderTable(firstPrevProps)
          : null }
        </div>
        <div className="second-table">
          {!isEmpty(secondPrevProps) ?
          renderTable(secondPrevProps)
          : null }
        </div>
        {thirdPrevProps.map((item, key) => (
          <div className="third-table">
            {renderTable(item)}
          </div>
        ))}
      </>
    )
  }

  switch (threshold(Number(props.answerData.score))) {
    case 'error':
      color = "error"
      textColor = '#d32f2f'
      icon = <img src="https://img.icons8.com/ios-filled/40/d32f2f/delete-sign--v1.png"/>
      break
    case 'warning':
      color = "warning"
      textColor = '#ED6C02'
      icon = <img src="https://img.icons8.com/material/40/ED6C02/exclamation-mark.png"/>
      break
    case 'success':
      color = "success"
      textColor = '#2e7d32'
      icon = <img src="https://img.icons8.com/external-becris-lineal-becris/40/2e7d32/external-check-mintab-for-ios-becris-lineal-becris-1.png"/>
      break
  }
  
  return (
    <>
      {!isEmpty(prevProps) ?
      <div className="vh-90 answer-container">
          <div className="w-100">
              <table className="custom-table">
                <tbody>
                <tr>
                  <td className="table-header">{t("score")}</td>
                  <td className="table-header progress-header">{t("progress")}</td>
                </tr>
                <tr>
                  <td rowSpan={3} style={{paddingRight: '4px'}}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress size={95} value={Number(props.answerData.score)*100} variant="determinate" color={color} style={{backgroundColor: '#F5F4F4', borderRadius: '50%'}} />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="h4"
                          component="div"
                          color={textColor}
                        >{props.answerData.score}</Typography>
                      </Box>
                    </Box>
                  </td>
                  <td className="table-text_block">
                    <div className="table-text table-text_question">{props.answerData.question}</div>
                    <div className="table-text table-text_correct-answer">{props.answerData.answer}</div>
                  </td>
                </tr>
                <tr>
                  <td className="table-text table-text_answer">{icon} {props.answerData.user_answer}</td>
                </tr>
                </tbody>
              </table> 
              <div className="table_line"></div>
              {firstPrevProps && renderPrevProps()}
          </div>
      </div> : null }
    </>
  )
}

export default Answer