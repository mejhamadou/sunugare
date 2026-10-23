package sn.jokko.sunugare.dto;

public class AuthResponse {
    private String token;
    private String email;

    public AuthResponse(String token, String email) {
        this.token = token;
        this.email = email;
    }

    // Getters
    public String getToken() { return token; }
    public String getEmail() { return email; }
}