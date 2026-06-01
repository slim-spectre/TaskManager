using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

public static class TasksEndpoints
{
    const string GetTaskEndpointName = "GetTask";
    
    public static void MapTasksEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/tasks").RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal userPrincipal, AppDbContext DbContext) =>
        {
            var userId = GetUserId(userPrincipal);
            
            return await DbContext.Tasks
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        });

        group.MapGet("/{id}", async (int id, ClaimsPrincipal userPrincipal, AppDbContext DbContext) =>
        {
            var userId = GetUserId(userPrincipal);
            var task = await DbContext.Tasks.FindAsync(id);

            if (task is null || task.UserId != userId) return Results.NotFound();
        
            return Results.Ok(task);
        }).WithName(GetTaskEndpointName);

        group.MapPost("/", async (TaskItem task, ClaimsPrincipal userPrincipal, AppDbContext DbContext) => 
        {
            var errors = task.Validate();
            if (errors != null) return Results.BadRequest(errors);

            task.UserId = GetUserId(userPrincipal);
            task.CreatedAt = DateTime.UtcNow;

            DbContext.Tasks.Add(task);
            await DbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetTaskEndpointName, new { id = task.Id }, task);
        });

        group.MapPut("/{id}", async (int id, TaskItem task, ClaimsPrincipal userPrincipal, AppDbContext DbContext) =>
        {
            var errors = task.Validate();
            if (errors != null) return Results.BadRequest(errors);

            var userId = GetUserId(userPrincipal);
            var taskToFind = await DbContext.Tasks.FindAsync(id);
            
            if (taskToFind is null || taskToFind.UserId != userId) return Results.NotFound();
            
            taskToFind.Title = task.Title;
            taskToFind.Description = task.Description;
            taskToFind.Priority = task.Priority;
            taskToFind.Status = task.Status;

            await DbContext.SaveChangesAsync();
            return Results.NoContent();
        });
        group.MapDelete("/{id}", async (int id, ClaimsPrincipal userPrincipal, AppDbContext DbContext) => 
        {
            var userId = GetUserId(userPrincipal);
            var task = await DbContext.Tasks.FindAsync(id);
            
            if (task is null || task.UserId != userId) return Results.NotFound();
            
            DbContext.Tasks.Remove(task);
            await DbContext.SaveChangesAsync();

            return Results.NoContent();
        });
    }
    private static int GetUserId(ClaimsPrincipal user)
    {
        var claim = user.FindFirst(ClaimTypes.NameIdentifier) ?? user.FindFirst("sub");
        return claim != null ? int.Parse(claim.Value) : 0;
    }
}