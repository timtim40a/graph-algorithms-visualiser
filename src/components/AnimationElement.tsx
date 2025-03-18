import { AnimationElementProps } from "@/app/types"
import "../styles/AnimationElement.css"

const AnimationElement: React.FC<AnimationElementProps> = ({node, weight = ""}) => {
    return (
        <div className="animation-element">
                <>
                <div className="optional">
                    <label className="arrow-label">{"  —"}</label>
                    {weight ? <label className="weight-label">{weight}</label> : null}
                    <label className="arrow-label">{"→  "}</label>
                </div>
                <label className={"node-label"}>{node.toUpperCase() + " "}</label>
                </>
        </div>
    )
}

export default AnimationElement