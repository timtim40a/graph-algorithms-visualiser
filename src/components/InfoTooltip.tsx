const InfoTooltip = (
  x: number,
  y: number,
  heading: string,
  textInput?: string
) => {
  const textToDisplay = textInput ? textInput : ''

  return (
    <div
      className="info-tooltip"
      style={{ position: 'absolute', top: y, left: x }}
    >
      <label>{heading}</label>
      <p>{textToDisplay}</p>
    </div>
  )
}
