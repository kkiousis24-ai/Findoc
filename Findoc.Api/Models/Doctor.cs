namespace Findoc.Api.Models;

public class Doctor
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Specialty { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public decimal ConsultationPrice { get; set; }

    public double Rating { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public ICollection<Appointment> Appointments { get; set; }
    = new List<Appointment>();
    
}