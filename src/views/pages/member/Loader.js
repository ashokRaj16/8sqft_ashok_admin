import { CSpinner } from "@coreui/react";

const Loader = () => {
    const loaderStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    }

    return (
        <>
            <div style={loaderStyle}>
              <CSpinner variant="grow" color="warning" />
            </div>
        </>
    )
}

export default Loader;