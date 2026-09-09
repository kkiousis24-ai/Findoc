namespace Findoc.Api.Models;

public class Doctor
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Specialty { get; set; } = string.Empty;

    public string Subspecialty { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Area { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Website { get; set; } = string.Empty;

    public decimal ConsultationPrice { get; set; }

    public int YearsOfExperience { get; set; }

    public double Rating { get; set; }

    public int ReviewCount { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public bool AcceptsInsurance { get; set; }

    public string InsuranceProviders { get; set; } = string.Empty;

    public bool OffersOnlineConsultation { get; set; }

    public bool IsVerified { get; set; }

    public bool IsActive { get; set; } = true;

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public string Languages { get; set; } = string.Empty;

    public ICollection<Appointment> Appointments { get; set; }
        = new List<Appointment>();
}