
type ToggleButtonProps = {
    id: string;
    isActive: boolean;
    onClick: React.MouseEvent<HTMLButtonElement>;
    label: string;
};

const ToolButton: React.FC<ToggleButtonProps> = ({id, onClick, label}) => {

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