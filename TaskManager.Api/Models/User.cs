using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id {get;set;}

    [Required]
    required public string Email{get;set;}

    required public string PasswordHash {get;set;}

    public DateTime CreatedAt {get;set;}




}