using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

    public DbSet<TaskItem> Tasks {get;set;}

    public DbSet<User> Users {get;set;}

    public DbSet<RefreshToken> RefreshTokens {get;set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Status)
            .HasConversion<string>();
    }
}