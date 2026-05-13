import "./Modal.css"

function Modal({ children, onClose } : {children: React.ReactNode, onClose: () => void}) {
    return (
        <div className="overlay" >

            <div
            onClick={onClose}
                className="backdrop "
                
            />

            <div className="modal">
                {children}
            </div>

        </div>
    );
}

export default Modal