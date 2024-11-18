
type ToolButtonProps = {
    id: string;
    isActive: boolean;
    onClick: React.MouseEvent<HTMLButtonElement>;
    label: string;
};

const ToolButton: React.FC<ToolButtonProps> = ({id, onClick, label}) => {

    return (
        <>
        <button
            onClick={(e) => onClick}
            id={id}>
            {label}
        </button>
        
        </>
    )
}