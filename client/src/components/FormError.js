const FormError = ({formErrors,element})=>{

    return (
        <>
        {
        formErrors[element] ? (
                <div style={{"color":"red"}}>
                    {formErrors[element]}
                </div>
                ) : ''
        }
        </>
    )
}

export default FormError;