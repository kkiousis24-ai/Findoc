namespace Findoc.Api.Models;

public class DoctorInterest
{
    public int Id { get; set; }

    public string FullName { get; set; } =
        string.Empty;

    public string Specialty { get; set; } =
        string.Empty;

    public string City { get; set; } =
        string.Empty;

    public string Area { get; set; } =
        string.Empty;

    public string Email { get; set; } =
        string.Empty;

    public string Phone { get; set; } =
        string.Empty;

    public string Message { get; set; } =
        string.Empty;

    public bool ConsentToContact { get; set; }

    public string Status { get; set; } =
        "New";

    public DateTime CreatedAtUtc { get; set; } =
        DateTime.UtcNow;
}