import './answer.scss'

import { useEffect, useRef, useState } from 'react'

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

const useHasChanged= (val: any) => {
  const prevVal = usePrevious(val)
  return prevVal !== val
}

function isEmpty(obj: any) {
  for (let key in obj) {
    return false;
  }
  return true;
}



const Answer = (props: TAnswerProps) => {
  console.log(props);
  
  const prevProps = usePrevious(props.answerData)
  const hasChangedPrevProps = useHasChanged(props.answerData)
  const [thirdPrevProps, setThirdPrevProps] = useState<TAnswerData>({})
  const [secondPrevProps, setSecondPrevProps] = useState<TAnswerData>({})
  const [firstPrevProps, setFirstPrevProps] = useState<TAnswerData>({})
  
  useEffect(() => {    
    if (hasChangedPrevProps) {      
      secondPrevProps && setThirdPrevProps(secondPrevProps)
      firstPrevProps && setSecondPrevProps(firstPrevProps)
      prevProps && setFirstPrevProps(prevProps)
    }
  }, [hasChangedPrevProps, secondPrevProps, firstPrevProps, prevProps])

  const renderTable = (prevProps: TAnswerData): JSX.Element => {
    return (
      <>
        <table className="prev-table">
          <tbody>
          <tr>
            <td className="table-header">Score</td>
            <td className="table-header">Summary</td>
          </tr>
          <tr>
            <td></td>
            <td className="table-text table-text_question">{prevProps.question}</td>
          </tr>
          <tr>
            <td className="table-text table-text_score">{prevProps.score}</td>
            <td className="table-text table-text_answer">{prevProps.user_answer}</td>
          </tr>
          <tr>
            <td></td>
            <td className="table-text table-text_correct-answer">{prevProps.answer}</td>
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
        <div className="third-table">
          {!isEmpty(thirdPrevProps) ?
          renderTable(thirdPrevProps)
          : null }
        </div>
      </>
    )
  }
  
  return (
    <>
      {!isEmpty(prevProps) ?
      <div className="vh-90 answer-container">
          <div className="w-100">
              <table className="custom-table">
                <tbody>
                <tr>
                  <td className="table-header">Score</td>
                  <td className="table-header">Summary</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="table-text table-text_question">{props.answerData.question}</td>
                </tr>
                <tr>
                  <td className="table-text table-text_score">{props.answerData.score}</td>
                  <td className="table-text table-text_answer">{props.answerData.user_answer}</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="table-text table-text_correct-answer">{props.answerData.answer}</td>
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