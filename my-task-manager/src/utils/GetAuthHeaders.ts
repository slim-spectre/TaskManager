export const GetAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
    }
}