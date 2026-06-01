export const validateTitle = (title: string, requiredErrorMsg: string): string => {
    if (!title || title.trim().length === 0 || title.trim().length > 100) {
        return requiredErrorMsg;
    }
    return "";
};

export const validateDescription = (description: string, lengthErrorMsg: string): string => {
    if (description && description.trim().length > 100) {
        return lengthErrorMsg;
    }
    return "";
};

export const validateEmail = (email: string, emailErrorMsg : string): string => {
    if (!email || email.trim().length < 15 || !email.includes("@gmail.com")){
        return emailErrorMsg;
    }
    return "";
}
export const validatePassword = (password: string,passwordErrorMsg: string): string => {
    if (!password || password.trim().length < 12){
        return passwordErrorMsg;
    }
    return "";
}