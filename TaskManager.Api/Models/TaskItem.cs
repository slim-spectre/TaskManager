using System.ComponentModel.DataAnnotations;

public class TaskItem
{
    public int Id {get;set;}

    [Required(ErrorMessage = "Title is required")]
    [StringLength(100,ErrorMessage = "Title cannot exceed 100 characters")]
    public required string Title {get;set;}

    [StringLength(500,ErrorMessage = "Description cannot exceed 500 characters")]
    public required string Description {get;set;}

    public TaskStatus Status {get;set;}

    public TaskPriority Priority {get;set;}

    public DateTime CreatedAt {get;set;}

    public int UserId {get;set;}

}