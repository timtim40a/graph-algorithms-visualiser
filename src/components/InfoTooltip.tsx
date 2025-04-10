import { InfoTooltipProps } from '@/app/types'
import '../styles/InfoTooltip.css'
import infoTooltipsContents from '@/utilities/InfoTooltipsContent'

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  x,
  y,
  heading,
  textInput,
}) => {
  const textDefaultContent: [string, string] = infoTooltipsContents.get(
    heading
  ) ?? [
    heading,
    'this element is not decribed yet, click on other elements on the screen',
  ]
  const textToDisplay = textInput
    ? textInput + textDefaultContent[1]
    : textDefaultContent[1]

  return (
    <div
      className="info-tooltip"
      style={{ position: 'absolute', top: y, left: x }}
    >
      <label>
        <b>{textDefaultContent[0]}</b>
      </label>
      <p>{textToDisplay}</p>
    </div>
  )
}

export default InfoTooltip
