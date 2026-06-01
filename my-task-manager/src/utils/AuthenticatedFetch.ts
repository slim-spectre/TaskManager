import { GetAuthHeaders } from "./GetAuthHeaders";

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
    options.headers = {
        ...options.headers,
        ...GetAuthHeaders()
    };

    let response = await fetch(url, options);

    if (response.status === 401) {
        const RefreshToken = localStorage.getItem("refreshToken");

        if (!RefreshToken) {
            localStorage.clear();
            window.location.href = "/login";
            return response;
        }

        try {
            const refreshResponse = await fetch("http://localhost:5208/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ RefreshToken: RefreshToken }) 
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                
                localStorage.setItem("accessToken", data.access || data.token || data.accessToken);
                localStorage.setItem("refreshToken", data.refresh || data.refreshToken);

                options.headers = {
                    ...options.headers,
                    ...GetAuthHeaders() 
                };
                response = await fetch(url, options);
            } else {
                localStorage.clear();
                window.location.href = "/login";
            }
        } catch (error) {
            console.error(error);
            localStorage.clear();
            window.location.href = "/login";
        }
    }

    return response;
}