import { MessageProps } from "@/app/types"
import "../styles/InformationWindow.css"

const InformationWindow : React.FC<MessageProps> = ({info, inftype}) => {

    return <p key="inf" className={"info-window " + inftype} >{info}</p>

}

export default InformationWindow