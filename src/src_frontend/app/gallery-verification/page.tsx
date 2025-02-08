import OpenPlot_gallery_verification from "./OpenPlot_gallery_verification/OpenPlot_gallery_verification"
import OpenPlaot_VideoVerification   from "./OpenPlaot_VideoVerification/OpenPlaot_VideoVerification"
import OpenPlot_verifyVerification    from "./OpenPlot_verifyVerification/OpenPlot_verifyVerification"
import  OpenPlot_ImageVerification     from "./OpenPlot_ImageVerification/OpenPlot_ImageVerification"
export default function OpenPlotMain() {
    return(
        <>
            <OpenPlot_gallery_verification/>
            <OpenPlaot_VideoVerification/>
            <OpenPlot_verifyVerification/>
            {/* <OpenPlot_ImageVerification/> */}
        </>
    )
}