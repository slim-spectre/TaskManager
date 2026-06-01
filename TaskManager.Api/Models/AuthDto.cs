using System.ComponentModel.DataAnnotations;

public class AuthDto
{
    [Required]
    [EmailAddress]
    public required string Email {get;set;}

    [Required]
    [StringLength(100,MinimumLength = 6,ErrorMessage = "Password must be at least 6 characters")]
    public required string Password {get;set;}
}