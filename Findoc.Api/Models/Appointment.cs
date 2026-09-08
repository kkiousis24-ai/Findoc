namespace Findoc.Api.Models;

public class Appointment
{
    public int Id { get; set; }

    public int DoctorId { get; set; }

    public Doctor Doctor { get; set; } = null!;

    public int? UserId { get; set; }

    public ApplicationUser? User { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public string PatientEmail { get; set; } = string.Empty;

    public DateTime StartsAt { get; set; }

    public string Status { get; set; } = "Confirmed";

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}