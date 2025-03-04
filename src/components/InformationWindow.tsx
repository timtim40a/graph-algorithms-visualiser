import { MessageProps } from "@/app/types"
import "../styles/InformationWindow.css"

const InformationWindow : React.FC<MessageProps> = ({info, inftype}) => {

    return <label key="inf" className={"info-window " + inftype} >{info}</label>

}

export default InformationWindow