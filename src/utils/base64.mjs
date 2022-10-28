export function ConvertBufferToBase64(buffer){
    const base64_string=buffer.toString('base64')
    return base64_string
}
export function VerifyIfIsBase64(base64_string){
    var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
    if (!base64Matcher.test(base64_string)) {
       return false
    } 
    return true
}