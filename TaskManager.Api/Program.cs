using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options => {
    options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});


builder.Services.AddOpenApi();

var jwtSecret = "SuperSecretKeyThatIsLongEnoughToSecureThisApp2026!";
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; 
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,   
        ValidateAudience = false, 
        ValidateLifetime = true, 
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(); 


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ...
var app = builder.Build();

app.UseCors("MyReactPolicy");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseAuthentication(); 
app.UseAuthorization();
app.MapTasksEndpoints();
app.MapAuthEndpoints();

app.Run();

