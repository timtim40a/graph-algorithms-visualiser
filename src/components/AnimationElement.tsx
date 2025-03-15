import { AnimationElementProps } from "@/app/types"
import "../styles/AnimationElement.css"

const AnimationElement: React.FC<AnimationElementProps> = ({node, visible, active, weight = ""}) => {
    return (
        <div className="animation-element">
            {visible ?
                <>
                <div className="optional">
                    <label className="arrow-label">{"  —"}</label>
                    {weight ? <label className="weight-label">{weight}</label> : null}
                    <label className="arrow-label">{"→  "}</label>
                </div>
                <label className={active ? "active node-label" : "node-label"}>{node.toUpperCase() + " "}</label>
                </>
            : null}
        </div>
    )
}

export default AnimationElement