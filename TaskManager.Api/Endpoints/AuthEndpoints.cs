using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

public static class AuthEndpoints
{
    private const string JwtSecret = "SuperSecretKeyThatIsLongEnoughToSecureThisApp2026!";
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/auth");
        var passwordHasher = new PasswordHasher<User>();


        group.MapPost("/register", async (AuthDto dto, AppDbContext dbContext) =>
        {
            var errors = dto.Validate();
            if(errors != null) return Results.BadRequest(errors);

            var userExists = await dbContext.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if(userExists) return Results.BadRequest(new[] {"User with this email already exists"});

            var newUser = new User {
                Email = dto.Email,
                CreatedAt = DateTime.UtcNow,
                PasswordHash = ""
            };

            newUser.PasswordHash = passwordHasher.HashPassword(newUser, dto.Password);
            dbContext.Users.Add(newUser);
            await dbContext.SaveChangesAsync();

            (string accessToken, DateTime accessTokenExpiry) = GenerateJwtToken(newUser);
            var refreshToken = Guid.NewGuid().ToString();
            var RefreshData = new RefreshToken
            {
                Token = refreshToken,
                UserId = newUser.Id,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                IsRevoked = false,
            };
            dbContext.RefreshTokens.Add(RefreshData);
            await dbContext.SaveChangesAsync();

            return Results.Ok(new
            {
                access = accessToken,
                refresh = refreshToken,
                message = "Registration successfully"
            });
        });

        group.MapPost("/login", async (AuthDto dto,AppDbContext dbContext) =>
        {
           var errors = dto.Validate();
           if(errors != null) return Results.BadRequest(errors);

           var user= await dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
           if(user == null) return Results.BadRequest(new[] {"Invalid email or password"});

           var verificationResult = passwordHasher.VerifyHashedPassword(user,user.PasswordHash,dto.Password);
           if(verificationResult == PasswordVerificationResult.Failed)
            {
                return Results.BadRequest(new[] {"Invalid email or password"});
            }

           (string accessToken,DateTime accessTokenExpiry) = GenerateJwtToken(user);
           var refreshToken = Guid.NewGuid().ToString();
           var RefreshData = new RefreshToken
           {
               Token = refreshToken,
               UserId = user.Id,
               ExpiryDate = DateTime.UtcNow.AddDays(7),
               IsRevoked = false,
           };
           dbContext.RefreshTokens.Add(RefreshData);
           await dbContext.SaveChangesAsync();
           return Results.Ok(new
            {
                access = accessToken,
                refresh = refreshToken,
                message = "Logged in successfully"
            });
    
        });

        group.MapPost("/refresh", async (RefreshRequestDto dto,AppDbContext dbContext) =>
        {
            var findRefresh = await dbContext.RefreshTokens.FirstOrDefaultAsync(t => t.Token == dto.RefreshToken);
            if(findRefresh is null) return Results.BadRequest("Invalid Token");
            if(findRefresh.IsRevoked) return Results.BadRequest("Token revoked");
            if(findRefresh.ExpiryDate < DateTime.UtcNow) return Results.BadRequest("Token expired");

            var user = await dbContext.Users.FindAsync(findRefresh.UserId);
            if(user is null) return Results.BadRequest("User not found");

            var newAccessToken = GenerateJwtToken(user).Token;
            findRefresh.IsRevoked = true;
            var newRefreshTokenString = Guid.NewGuid().ToString();
            var newRefreshToken = new RefreshToken
            {
                    Token = newRefreshTokenString,
                    UserId = user.Id,
                    ExpiryDate = DateTime.UtcNow.AddDays(7),
                    IsRevoked = false,
            };

            dbContext.RefreshTokens.Add(newRefreshToken);
            await dbContext.SaveChangesAsync();

            return Results.Ok(new
            {
                access = newAccessToken,
                refresh = newRefreshTokenString,
                message = "Refreshed successfully"
            });
        });
    }


    private static (string Token,DateTime Expires) GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(JwtSecret);
            var expires = DateTime.UtcNow.AddMinutes(15);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = expires,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return (tokenHandler.WriteToken(token),expires);
        }

}