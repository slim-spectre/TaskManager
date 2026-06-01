using System.ComponentModel.DataAnnotations;

public static class ValidationExtensions
{
    public static IEnumerable<string>? Validate<T>(this T obj) where T : class
    {
        var validationContext = new ValidationContext(obj);
        var validationResults = new List<ValidationResult>();

        if (!Validator.TryValidateObject(obj, validationContext, validationResults, true))
        {
            return validationResults.Select(e => e.ErrorMessage ?? "Validation error");
        }
        return null;
    }
}